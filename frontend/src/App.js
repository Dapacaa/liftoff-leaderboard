// Import necessary components and files
import Navigation from './components/Navigation'; // Navigation component for the top menu
import Grid from './components/Grid'; // Grid component to display data
import maps from './maps.json'; // JSON file containing map data
import React from 'react'; // React library for creating components

// Define the main App component as a class-based React component
class App extends React.Component {
  // Constructor initializes the component's state and binds methods
  constructor(props) {
    super(props); // Call the parent class constructor
    this.state = {
      steam_id: "", // Stores the extracted Steam ID
      input: "", // Stores the user input from the text box
      top_menu_cliked: "STRAW BALE", // Tracks the currently selected menu option
    };
    this.topMenuClicked = this.topMenuClicked.bind(this); // Bind the method to the class instance
  }

  // Method to handle menu clicks and update the selected menu item
  topMenuClicked(value) {
    this.setState({ top_menu_cliked: value }); // Update state with the selected menu value
  }

  // The render method returns the JSX that defines the component's UI
  render() {
    return (
      <div style={{ backgroundColor: "#adb5bd" }} className="App">
        {/* Render the Navigation component and pass the topMenuClicked method as a prop */}
        <Navigation topMenuClicked={this.topMenuClicked} />
        
        {/* Input form for the user to paste their Steam profile URL */}
        <div style={{ marginBottom: "10px", marginTop: "10px", margin: "0 auto", width: "50%", textAlign: "left" }}>
          <div className="form-group">
            <label style={{ fontSize: "20px" }} htmlFor="formGroupExampleInput">
              Paste your public Steam URL for comparing the results
            </label>
            <input 
              value={this.state.input} // Controlled input tied to state
              type="text" // Text input field
              className="form-control" // Bootstrap class for styling
              id="formGroupExampleInput" // HTML ID for the input element
              placeholder="example -> https://steamcommunity.com/profiles/7656119831165XXXX/"
              // Event handler for when the input value changes
              onChange={(event) => {
                this.setState({ input: event.target.value }); // Update input state with the current value
                try {
                  // Extract the longest sequence of digits from the input (likely the Steam ID)
                  let regex = /\d+/g; // Regular expression to match sequences of digits
                  let matches = event.target.value.match(regex); // Get all matches in the input string
                  let longest = ""; // Variable to store the longest match
                  for (let match of matches) {
                    if (match.length > longest.length) {
                      longest = match; // Update if a longer match is found
                    }
                  }
                  if (longest.length > 15) { // Ensure the Steam ID is of valid length
                    this.setState({ steam_id: longest }); // Update the state with the extracted Steam ID
                  }
                } catch {
                  // Catch block to prevent crashes in case of unexpected input
                }
              }} 
            />
          </div>
        </div>

        {/* Render the Grid component, passing necessary props */}
        <Grid 
          steam_id={this.state.steam_id} // Pass the Steam ID
          map_name={this.state.top_menu_cliked} // Pass the selected menu item
          tracks={maps.MAPS[this.state.top_menu_cliked]} // Pass map data based on the selected menu item
        />
      </div>
    );
  }
}

// Export the App component as the default export of the module
export default App;
