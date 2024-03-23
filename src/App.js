import React from 'react';
import './App.css';
import Header from "./Header";
import Footer from "./Footer";

// mui icons
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";

class App extends React.Component {
  constructor(props) {
    super(props);
    let items = [
      { id: 1, text: "Here is a task for example", done: false }
    ];
    const loadFromLocalStorage = window.confirm("Do you want to load tasks from LocalStorage?");
    if (loadFromLocalStorage) {
      const storedItems = localStorage.getItem('todoItems');
      if (storedItems) {
        items = JSON.parse(storedItems);
      }
    }
    this.state = {
      items: items,
      newItemText: "",
      searchText: "",
      loadFromLocalStorage: false
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
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
  }

  handleSaveToLocalStorage = () => {
    localStorage.setItem('todoItems', JSON.stringify(this.state.items));
  }

  handleLoadFromLocalStorage = () => {
    const storedItems = localStorage.getItem('todoItems');
    if (storedItems) {
      this.setState({ items: JSON.parse(storedItems) });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // We do not store in local storage manually anymore
    //localStorage.setItem('todoItems', JSON.stringify(this.state.items));
  }

  handleInputChange(event) {
    this.setState({ newItemText: event.target.value });
  }

  handleFormSubmit(newTask, selectedIcon) {
    if (newTask.trim() !== "") {
      const newItem = {
        id: Date.now(),
        text: newTask,
        icon: selectedIcon,
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

  handleChangeCategory(id, newCategory) {
    this.setState(prevState => ({
      items: prevState.items.map(item =>
          item.id === id ? { ...item, category: newCategory } : item
      )
    }));
  }

  render() {
    let filteredItems = this.state.items;
    if (this.state.searchText.length >= 3) {
      filteredItems = filteredItems.filter(item =>
          item.text.toLowerCase().includes(this.state.searchText.toLowerCase())
      );
    }

    const headerStyle = {
      opacity: this.state.searchText.length >= 3 ? 0.5 : 1
    };

    return (
        <div>
          <Header items={this.state.items} style={headerStyle}/>

          <h2>Todos:</h2>
          <ol>
            {filteredItems.map((item, index) => {
              let Icon;
              switch (item.icon) {
                case 'Work':
                  Icon = WorkIcon;
                  break;
                case 'Personal':
                  Icon = PersonIcon;
                  break;
                case 'Life':
                  Icon = FavoriteIcon;
                  break;
                default:
                  Icon = WorkIcon;
              }
              return (
                  <li
                      key={item.id}
                      draggable
                      onDragStart={e => this.handleDragStart(e, item.id)}
                      onDragOver={this.handleDragOver}
                      onDrop={e => this.handleDrop(e, index)}
                  >
                    <Icon/>
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
              );
            })}
          </ol>
          <Footer
              state={this.state}
              handleFormSubmit={this.handleFormSubmit}
              handleInputChange={this.handleInputChange}
              handleSearchInputChange={this.handleSearchInputChange}
          />
          <button onClick={this.handleSaveToLocalStorage}>Save tasks</button>
          <button onClick={this.handleLoadFromLocalStorage}>Load tasks</button>
        </div>
    )
        ;
  }
}

export default App;
