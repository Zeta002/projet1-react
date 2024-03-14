import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { id: 1, text: "Learn JavaScript", done: false },
        { id: 2, text: "Learn React", done: false },
        { id: 3, text: "Play around in JSFiddle", done: true },
        { id: 4, text: "Build something awesome", done: true }
      ],
      newItemText: "",
      searchText: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTaskStateToggle = this.handleTaskStateToggle.bind(this);
    this.handleDeleteTask = this.handleDeleteTask.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({ newItemText: event.target.value });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.state.newItemText.trim() !== "") {
      const newItem = {
        id: Date.now(),
        text: this.state.newItemText,
        done: false
      };
      this.setState(prevState => ({
        items: [...prevState.items, newItem],
        newItemText: ""
      }));
    }
  }

  handleTaskStateToggle(id) {
    this.setState(prevState => ({
      items: prevState.items.map(item =>
          item.id === id ? { ...item, done: !item.done } : item
      )
    }));
  }

  handleDeleteTask(id) {
    this.setState(prevState => ({
      items: prevState.items.filter(item => item.id !== id)
    }));
  }

  handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDrop(e, index) {
    const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const items = this.state.items.slice();
    const itemIndex = items.findIndex(item => item.id === id);
    const [draggedItem] = items.splice(itemIndex, 1);
    items.splice(index, 0, draggedItem);
    this.setState({ items });
  }

  handleMoveUp(index) {
    if (index === 0) return;
    const items = [...this.state.items];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    this.setState({ items });
  }

  handleMoveDown(index) {
    if (index === this.state.items.length - 1) return;
    const items = [...this.state.items];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    this.setState({ items });
  }

  handleSearchInputChange(event) {
    this.setState({ searchText: event.target.value });
  }

  render() {
    const filteredItems = this.state.items.filter(item =>
        item.text.toLowerCase().includes(this.state.searchText.toLowerCase())
    );

    return (
        <div>
          <h2>Todos:</h2>
          <form onSubmit={this.handleFormSubmit}>
            <input
                type="text"
                value={this.state.newItemText}
                onChange={this.handleInputChange}
                placeholder="Add a new task"
            />
            <button type="submit">Add Task</button>
          </form>
          <input
              type="text"
              value={this.state.searchText}
              onChange={this.handleSearchInputChange}
              placeholder="Search tasks"
          />
          <ol>
            {filteredItems.map((item, index) => (
                <li
                    key={item.id}
                    draggable
                    onDragStart={e => this.handleDragStart(e, item.id)}
                    onDragOver={this.handleDragOver}
                    onDrop={e => this.handleDrop(e, index)}
                >
                  <label>
                    <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => this.handleTaskStateToggle(item.id)}
                    />
                    <span className={item.done ? "done" : ""}>{item.text}</span>
                  </label>
                  <button onClick={() => this.handleDeleteTask(item.id)}>Delete</button>
                  {index !== 0 && (
                      <button onClick={() => this.handleMoveUp(index)}>↑</button>
                  )}
                  {index !== this.state.items.length - 1 && (
                      <button onClick={() => this.handleMoveDown(index)}>↓</button>
                  )}
                </li>
            ))}
          </ol>
        </div>
    );
  }
}

export default App;
