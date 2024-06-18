import React, { useEffect, useState } from 'react';
import TicketList from '../Components/TicketList';
import Stats from '../Components/Stats';
import { viewTickets } from '../utils/networkHelper'; // Importing function to fetch tickets
import './Dashboard.css'; // Importing the CSS file for styling

// Functional component for the dashboard
const Dashboard = () => {
  // State to store the list of tickets
  const [tickets, setTickets] = useState([]);
  
  // State to store various statistics
  const [stats, setStats] = useState({
    unresolved: 0,
    overdue: 0,
    dueToday: 0,
    open: 0,
    onHold: 0,
    unassigned: 0
  });

  // useEffect hook to fetch tickets when the component mounts
  useEffect(() => {
    // Function to fetch tickets from the server
    const fetchTickets = async () => {
      const result = await viewTickets(); // Fetch tickets using the network helper
      if (result.success) {
        setTickets(result.tickets); // Update state with the fetched tickets
        
        // Calculate statistics based on the fetched tickets
        const unresolved = result.tickets.length;
        const overdue = result.tickets.filter(ticket => ticket.status === 'overdue').length;
        const dueToday = result.tickets.filter(ticket => ticket.status === 'dueToday').length;
        const open = result.tickets.filter(ticket => ticket.status === 'open').length;
        const onHold = result.tickets.filter(ticket => ticket.status === 'onHold').length;
        const unassigned = result.tickets.filter(ticket => !ticket.assignee).length;

        // Update state with the calculated statistics
        setStats({ unresolved, overdue, dueToday, open, onHold, unassigned });
      }
    };

    fetchTickets(); // Call the fetchTickets function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    // Main container for the dashboard
    <div className="dashboard">
      <div className="main-content">
        {/* Displaying statistics */}
        <Stats stats={stats} />
        {/* Displaying the list of tickets */}
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
};

export default Dashboard;