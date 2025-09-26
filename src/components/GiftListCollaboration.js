import React, { useState, useEffect, useCallback, useRef } from 'react';

// Gift List Collaboration Manager
export class CollaborationManager {
  constructor() {
    this.lists = new Map();
    this.collaborators = new Map();
    this.activeConnections = new Set();
    this.websocket = null;
  }

  createList(name, description, owner) {
    const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const list = {
      id: listId,
      name,
      description,
      owner,
      collaborators: [],
      items: [],
      votes: new Map(),
      comments: [],
      created: Date.now(),
      updated: Date.now(),
      isPublic: false,
      shareCode: this.generateShareCode()
    };

    this.lists.set(listId, list);
    this.saveToStorage();

    return list;
  }

  generateShareCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  addCollaborator(listId, collaborator) {
    const list = this.lists.get(listId);
    if (!list) return null;

    if (!list.collaborators.find(c => c.id === collaborator.id)) {
      list.collaborators.push({
        ...collaborator,
        joinedAt: Date.now(),
        permissions: ['view', 'comment', 'vote', 'add_items']
      });

      list.updated = Date.now();
      this.saveToStorage();

      // Notify other collaborators
      this.broadcastUpdate(listId, {
        type: 'collaborator_joined',
        data: collaborator
      });
    }

    return list;
  }

  addItemToList(listId, item, addedBy) {
    const list = this.lists.get(listId);
    if (!list) return null;

    const listItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedBy,
      addedAt: Date.now(),
      votes: 0,
      comments: []
    };

    list.items.push(listItem);
    list.updated = Date.now();
    this.saveToStorage();

    // Notify collaborators
    this.broadcastUpdate(listId, {
      type: 'item_added',
      data: listItem
    });

    return listItem;
  }

  voteForItem(listId, itemId, userId, voteType = 'up') {
    const list = this.lists.get(listId);
    if (!list) return null;

    const item = list.items.find(i => i.id === itemId);
    if (!item) return null;

    const voteKey = `${itemId}_${userId}`;
    const existingVote = list.votes.get(voteKey);

    if (existingVote === voteType) {
      // Remove vote if clicking same type
      list.votes.delete(voteKey);
      item.votes += voteType === 'up' ? -1 : 1;
    } else {
      // Add or change vote
      if (existingVote) {
        item.votes += voteType === 'up' ? 2 : -2;
      } else {
        item.votes += voteType === 'up' ? 1 : -1;
      }
      list.votes.set(voteKey, voteType);
    }

    list.updated = Date.now();
    this.saveToStorage();

    // Notify collaborators
    this.broadcastUpdate(listId, {
      type: 'item_voted',
      data: { itemId, votes: item.votes, userId, voteType }
    });

    return item;
  }

  addComment(listId, itemId, comment, userId) {
    const list = this.lists.get(listId);
    if (!list) return null;

    const item = list.items.find(i => i.id === itemId);
    if (!item) return null;

    const newComment = {
      id: `comment_${Date.now()}`,
      text: comment,
      userId,
      timestamp: Date.now()
    };

    item.comments.push(newComment);
    list.comments.push({ ...newComment, itemId });
    list.updated = Date.now();
    this.saveToStorage();

    // Notify collaborators
    this.broadcastUpdate(listId, {
      type: 'comment_added',
      data: { itemId, comment: newComment }
    });

    return newComment;
  }

  broadcastUpdate(listId, update) {
    // In a real app, this would use WebSockets or real-time database
    // For now, we'll use localStorage events for cross-tab communication
    const event = new CustomEvent('list-update', {
      detail: { listId, update }
    });
    window.dispatchEvent(event);
  }

  saveToStorage() {
    const listsData = Array.from(this.lists.entries());
    localStorage.setItem('collaborative_lists', JSON.stringify(listsData));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('collaborative_lists');
    if (stored) {
      const listsData = JSON.parse(stored);
      this.lists = new Map(listsData.map(([k, v]) => [k, { ...v, votes: new Map(v.votes || []) }]));
    }
  }
}

// Collaborative Gift List Component
export const CollaborativeGiftList = ({
  listId,
  currentUser,
  onItemClick,
  onShare
}) => {
  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('votes');

  const collaborationManager = useRef(new CollaborationManager());

  useEffect(() => {
    // Load list
    collaborationManager.current.loadFromStorage();
    const loadedList = collaborationManager.current.lists.get(listId);

    if (loadedList) {
      setList(loadedList);
    } else {
      // Create new list if not found
      const newList = collaborationManager.current.createList(
        'Gift Ideas',
        'Collaborative gift list',
        currentUser
      );
      setList(newList);
    }

    setIsLoading(false);

    // Listen for updates
    const handleUpdate = (event) => {
      if (event.detail.listId === listId) {
        const updatedList = collaborationManager.current.lists.get(listId);
        setList({ ...updatedList });
      }
    };

    window.addEventListener('list-update', handleUpdate);
    return () => window.removeEventListener('list-update', handleUpdate);
  }, [listId, currentUser]);

  const handleVote = (itemId, voteType) => {
    collaborationManager.current.voteForItem(listId, itemId, currentUser.id, voteType);
    const updatedList = collaborationManager.current.lists.get(listId);
    setList({ ...updatedList });
  };

  const handleComment = (itemId, comment) => {
    collaborationManager.current.addComment(listId, itemId, comment, currentUser.id);
    const updatedList = collaborationManager.current.lists.get(listId);
    setList({ ...updatedList });
  };

  const handleAddItem = (item) => {
    collaborationManager.current.addItemToList(listId, item, currentUser);
    const updatedList = collaborationManager.current.lists.get(listId);
    setList({ ...updatedList });
    setShowAddItem(false);
  };

  const getFilteredAndSortedItems = () => {
    if (!list) return [];

    let items = [...list.items];

    // Apply filter
    if (filter === 'my-items') {
      items = items.filter(item => item.addedBy.id === currentUser.id);
    } else if (filter === 'top-voted') {
      items = items.filter(item => item.votes > 0);
    }

    // Apply sort
    switch (sortBy) {
      case 'votes':
        items.sort((a, b) => b.votes - a.votes);
        break;
      case 'newest':
        items.sort((a, b) => b.addedAt - a.addedAt);
        break;
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return items;
  };

  if (isLoading) {
    return <div className="loading">Loading collaborative list...</div>;
  }

  if (!list) {
    return <div className="error">List not found</div>;
  }

  const filteredItems = getFilteredAndSortedItems();

  return (
    <div className="collaborative-gift-list">
      <div className="list-header">
        <div className="list-info">
          <h2>{list.name}</h2>
          <p>{list.description}</p>
          <div className="list-meta">
            <span className="collaborator-count">
              👥 {list.collaborators.length + 1} collaborators
            </span>
            <span className="item-count">
              🎁 {list.items.length} items
            </span>
          </div>
        </div>

        <div className="list-actions">
          <button
            className="add-item-btn"
            onClick={() => setShowAddItem(true)}
          >
            + Add Gift
          </button>
          <button
            className="invite-btn"
            onClick={() => setShowInvite(true)}
          >
            👥 Invite
          </button>
          <button
            className="share-list-btn"
            onClick={() => onShare && onShare(list)}
          >
            📤 Share
          </button>
        </div>
      </div>

      <div className="list-controls">
        <div className="filter-controls">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Items</option>
            <option value="my-items">My Items</option>
            <option value="top-voted">Top Voted</option>
          </select>
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="votes">Most Voted</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="collaborator-avatars">
        {list.collaborators.slice(0, 5).map((collaborator, index) => (
          <div
            key={collaborator.id}
            className="collaborator-avatar"
            style={{ left: `${index * 25}px` }}
            title={collaborator.name}
          >
            {collaborator.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {list.collaborators.length > 5 && (
          <div className="collaborator-more" style={{ left: '125px' }}>
            +{list.collaborators.length - 5}
          </div>
        )}
      </div>

      <div className="list-items">
        {filteredItems.map(item => (
          <CollaborativeGiftItem
            key={item.id}
            item={item}
            currentUser={currentUser}
            onVote={(voteType) => handleVote(item.id, voteType)}
            onComment={(comment) => handleComment(item.id, comment)}
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}

        {filteredItems.length === 0 && (
          <div className="empty-list">
            <p>No items yet. Be the first to add a gift idea!</p>
          </div>
        )}
      </div>

      {showAddItem && (
        <AddItemModal
          onAdd={handleAddItem}
          onClose={() => setShowAddItem(false)}
        />
      )}

      {showInvite && (
        <InviteCollaboratorsModal
          list={list}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
};

// Collaborative Gift Item Component
const CollaborativeGiftItem = ({ item, currentUser, onVote, onComment, onClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const hasVoted = false; // Track in real implementation

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="collaborative-gift-item">
      <div className="item-main" onClick={onClick}>
        <img
          src={item.image_url || '/api/placeholder/100/100'}
          alt={item.name || item.title}
          className="item-image"
        />

        <div className="item-details">
          <h3>{item.name || item.title}</h3>
          <p className="item-price">${item.price}</p>
          <div className="item-meta">
            <span className="added-by">
              Added by {item.addedBy.name}
            </span>
            <span className="added-time">
              {new Date(item.addedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="item-voting">
          <button
            className={`vote-btn up ${hasVoted ? 'voted' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onVote('up');
            }}
          >
            ▲
          </button>
          <span className="vote-count">{item.votes}</span>
          <button
            className={`vote-btn down`}
            onClick={(e) => {
              e.stopPropagation();
              onVote('down');
            }}
          >
            ▼
          </button>
        </div>
      </div>

      <div className="item-actions">
        <button
          className="comment-toggle"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {item.comments.length} comments
        </button>
      </div>

      {showComments && (
        <div className="item-comments">
          {item.comments.map(comment => (
            <div key={comment.id} className="comment">
              <strong>{comment.userId}:</strong> {comment.text}
              <span className="comment-time">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
          ))}

          <div className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Item Modal Component
const AddItemModal = ({ onAdd, onClose }) => {
  const [itemData, setItemData] = useState({
    name: '',
    price: '',
    url: '',
    image_url: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (itemData.name && itemData.price) {
      onAdd({
        ...itemData,
        price: parseFloat(itemData.price)
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add Gift Idea</h2>

        <div className="form-group">
          <label>Gift Name*</label>
          <input
            type="text"
            value={itemData.name}
            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
            placeholder="e.g., Wireless Headphones"
          />
        </div>

        <div className="form-group">
          <label>Price*</label>
          <input
            type="number"
            value={itemData.price}
            onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
            placeholder="99.99"
          />
        </div>

        <div className="form-group">
          <label>Link (optional)</label>
          <input
            type="url"
            value={itemData.url}
            onChange={(e) => setItemData({ ...itemData, url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            value={itemData.notes}
            onChange={(e) => setItemData({ ...itemData, notes: e.target.value })}
            placeholder="Why this would be perfect..."
            rows="3"
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="primary">Add Gift</button>
        </div>
      </div>
    </div>
  );
};

// Invite Collaborators Modal Component
const InviteCollaboratorsModal = ({ list, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/list/${list.id}?code=${list.shareCode}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Invite Collaborators</h2>

        <div className="invite-section">
          <h3>Share Code</h3>
          <div className="share-code-display">
            <span className="code">{list.shareCode}</span>
            <button onClick={copyLink}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div className="invite-section">
          <h3>Current Collaborators</h3>
          <div className="collaborator-list">
            {list.collaborators.map(collaborator => (
              <div key={collaborator.id} className="collaborator-item">
                <div className="collaborator-avatar">
                  {collaborator.name.charAt(0).toUpperCase()}
                </div>
                <span>{collaborator.name}</span>
                <span className="join-date">
                  Joined {new Date(collaborator.joinedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// List Activity Feed Component
export const ListActivityFeed = ({ listId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulate loading activities
    const mockActivities = [
      { id: 1, type: 'item_added', user: 'John', item: 'Smart Watch', time: '2 min ago' },
      { id: 2, type: 'vote', user: 'Sarah', item: 'Perfume Set', action: 'upvoted', time: '5 min ago' },
      { id: 3, type: 'comment', user: 'Mike', item: 'Book Collection', comment: 'Great idea!', time: '10 min ago' }
    ];
    setActivities(mockActivities);
  }, [listId]);

  return (
    <div className="list-activity-feed">
      <h3>Recent Activity</h3>
      <div className="activity-items">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {activity.type === 'item_added' ? '➕' :
               activity.type === 'vote' ? '👍' :
               activity.type === 'comment' ? '💬' : '📝'}
            </div>
            <div className="activity-content">
              <strong>{activity.user}</strong>
              {activity.type === 'item_added' && ` added "${activity.item}"`}
              {activity.type === 'vote' && ` ${activity.action} "${activity.item}"`}
              {activity.type === 'comment' && ` commented on "${activity.item}": "${activity.comment}"`}
            </div>
            <div className="activity-time">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  CollaborationManager,
  CollaborativeGiftList,
  ListActivityFeed
};