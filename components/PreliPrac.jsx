import React, { useState } from 'react';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Numbers to display
const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const PreliPrac = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [numberCounts, setNumberCounts] = useState(Array(9).fill(0)); // For the count row at the top
  const [isRolling, setIsRolling] = useState(false);
  const [currentRollIndex, setCurrentRollIndex] = useState(0);  // Initial value set to 0
  
  const [rollInterval, setRollInterval] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for theme

  const [modifiedNumbers, setModifiedNumbers] = useState(numbers); // Holds modified numbers (with 0 when stopped)
  const [previousValue, setPreviousValue] = useState(null); // Store the previous value before setting to 0
  const [stoppedIndex, setStoppedIndex] = useState(null); // Store the index of the stopped number

  const handleRollClick = () => {
    if (isRolling) {
      stopRoll();
    } else {
      roll();
    }
  };

  const roll = () => {
    setIsRolling(true);
    setSelectedNumber(null);

    // Restore the previous number before rolling
    if (previousValue !== null) {
      setModifiedNumbers(prevNumbers => {
        const newNumbers = [...prevNumbers];
        newNumbers[previousValue.index] = previousValue.value; // Restore the original value
        return newNumbers;
      });
      setPreviousValue(null);
    }

    // Increment the count when starting the next roll (for the number that was stopped)
    if (stoppedIndex !== null) {
      setNumberCounts(prevCounts => {
        const newCounts = [...prevCounts];
        newCounts[stoppedIndex] += 1; // Increment count for the last stopped number
        return newCounts;
      });
      setStoppedIndex(null); // Reset the stopped index after counting
    }

    const newSequence = shuffle([...Array(9).keys()]); // Shuffle the grid indices
    let sequenceIndex = 0;

    const intervalId = setInterval(() => {
      if (sequenceIndex >= newSequence.length) sequenceIndex = 0;
      setCurrentRollIndex(newSequence[sequenceIndex]);
      sequenceIndex++;
    }, 100); // Speed of rolling
    
    setRollInterval(intervalId);
  };

  const stopRoll = () => {
    clearInterval(rollInterval);
    const finalIndex = currentRollIndex;
    setSelectedNumber(finalIndex);
    setStoppedIndex(finalIndex); // Store the stopped number index for counting later
    setCurrentRollIndex(null);

    // Set the previous value before changing it to 0
    setPreviousValue({ index: finalIndex, value: modifiedNumbers[finalIndex] });

    // Set the selected number to 0
    setModifiedNumbers(prevNumbers => {
      const newNumbers = [...prevNumbers];
      newNumbers[finalIndex] = 0; // Change the selected number to 0
      return newNumbers;
    });

    setIsRolling(false);
  };

  const resetGame = () => {
    // Reset everything to initial state
    clearInterval(rollInterval);  // Stop any active rolling
    setSelectedNumber(null);
    setNumberCounts(Array(9).fill(0));  // Reset the counts to zero
    setCurrentRollIndex(null);
    setIsRolling(false);
    setModifiedNumbers(numbers); // Reset the numbers
    setPreviousValue(null); // Clear the previous value
    setStoppedIndex(null); // Clear the stopped index
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme); // Toggle between light and dark themes
  };

  const tileStyle = index => ({
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease-in-out', // For smooth scaling effect
    transform: (currentRollIndex === index || selectedNumber === index) ? 'scale(1.1)' : 'scale(1)', // Enlarge when selected
    border: (currentRollIndex === index || selectedNumber === index) ? '3px solid black' : '1px solid grey',
    cursor: 'pointer', // Show pointer on hover
    backgroundColor: isDarkTheme ? '#333' : '#fff', // Adjust background for theme
    color: isDarkTheme ? '#fff' : '#000', // Adjust text color for theme
  });

  const containerStyle = {
    backgroundColor: isDarkTheme ? '#121212' : '#f0f0f0', // Background for theme
    color: isDarkTheme ? '#fff' : '#000', // Text color for theme
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      <div>
        {/* Top number row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
          {numbers.map((num, index) => (
            <div key={index} style={{ 
              width: '30px', 
              height: '30px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              fontWeight: 'bold', 
              border: '1px solid black' 
            }}>
              {num}
            </div>
          ))}
        </div>
        
        {/* Count row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {numberCounts.map((count, index) => (
            <div key={index} style={{ 
              width: '30px', 
              height: '30px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              backgroundColor: isDarkTheme ? '#333' : '#fff', 
              color: isDarkTheme ? '#fff' : '#000', 
              fontWeight: 'bold', 
              border: '1px solid black' 
            }}>
              {count}
            </div>
          ))}
        </div>

        {/* Grid layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px', 
          margin: '20px auto', 
          width: '300px' 
        }}>
          {modifiedNumbers.map((num, index) => (
            <div key={index} style={tileStyle(index)}>
              {currentRollIndex === index ? 0 : num}
            </div>
          ))}
        </div>

        {/* Start/Stop Roll Button */}
        <button 
          onClick={handleRollClick} 
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            backgroundColor: isRolling ? '#f44336' : '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            margin: '20px 10px'
          }} 
        >
          {isRolling ? 'Stop Roll' : 'Start Roll'}
        </button>

        {/* Reset Button */}
        <button 
          onClick={resetGame} 
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            margin: '20px 10px'
          }} 
        >
          Reset
        </button>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            backgroundColor: isDarkTheme ? '#555' : '#222', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            margin: '20px 10px'
          }} 
        >
          {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        </button>
      </div>
    </div>
  );
};

export default PreliPrac;
