import React from 'react';

function Header(props) {
    const totalTasks = props.items.length;
    const completedTasks = props.items.filter(item => item.done).length;
    const completedPercentage = Math.round(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);

    return (
        <header style={props.style}>
            <p>Total number of tasks : {totalTasks}</p>
            <progress value={completedPercentage} max="100"></progress>
            <p>{completedPercentage}% task completed</p>
        </header>
    );
}

export default Header;