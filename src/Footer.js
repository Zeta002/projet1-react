import React, { useState } from 'react';
import {MenuItem, Select} from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Footer(props) {
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');

    const handleOpenModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (event) => {
        setNewTask(event.target.value);
    };

    const handleIconChange = (event) => {
        setSelectedIcon(event.target.value);
    };

    return (
        <footer>
            <button onClick={handleOpenModal}>Ajouter</button>
            {showModal && (
                <div className="modal-background">
                    <div className="modal">
                        <button onClick={handleCloseModal}>X</button>
                        <input
                            type="text"
                            value={newTask}
                            onChange={handleInputChange}
                            placeholder="Add a new task"
                        />
                        <Select
                            value={selectedIcon}
                            onChange={handleIconChange}
                        >
                            <MenuItem value="Work">
                                <WorkIcon />
                                Work
                            </MenuItem>
                            <MenuItem value="Personal">
                                <PersonIcon />
                                Personal
                            </MenuItem>
                            <MenuItem value="Life">
                                <FavoriteIcon />
                                Life
                            </MenuItem>
                        </Select>
                        <button onClick={() => {props.handleFormSubmit(newTask, selectedIcon); handleCloseModal();}}>Valider</button>
                    </div>
                </div>
            )}
            <input
                type="text"
                value={props.state.searchText}
                onChange={props.handleSearchInputChange}
                placeholder="Search tasks"
            />
        </footer>
    );
}

export default Footer;