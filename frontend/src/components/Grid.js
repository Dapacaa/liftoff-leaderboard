import React from 'react'; // React library for creating components
import Button from 'react-bootstrap/Button'; // Bootstrap Button component for styling
import Card from 'react-bootstrap/Card'; // Bootstrap Card component for styling
import LoadData from './LoadData'; // Component for loading detailed data
import packageJson from '../../package.json'; // Import package information (not used in this file)

// Functional Modal component to display a popup
const Modal = ({ handleClose, show, children }) => {
  // Determine the display style based on the "show" prop
  const showHideClassName = show ? "block" : "none";

  return (
      <div className='modal' style={{display: showHideClassName}}>
          <section className="modal-main">
              {children} {/* Render the children content inside the modal */}
              <div className="text-center">
                  <button className="btn btn-danger" type="button" onClick={handleClose}>
                      Close {/* Close button to hide the modal */}
                  </button>
              </div>
          </section>
      </div>
  );
};

// Class-based Grid component to display track details and handle popups
class Grid extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state variables
    const arr = new Array(this.props.tracks.length).fill(null); // Array to store dates for each track
    this.state = {
      bg: 'url("https://i.imgur.com/w4bt3MG.png")', // Background image URL
      initLoad: false, // Tracks initial load status
      showPopup: false, // Controls visibility of the popup
      ContentId: null, // ID of the selected track
      GamemodeFlags: null, // Game mode flags for the selected track
      ModifierFlags: null, // Modifier flags for the selected track
      Timestamp: null, // Timestamp for the selected track
      track: null, // Track details for the selected track
      date: null, // Selected date for leaderboard filtering
      name: null, // Name of the selected track
      date_array: arr, // Array of dates for all tracks
      FetchUserEntries: this.props.steam_id, // Steam ID passed as a prop
      value_drop_down: 1, // Dropdown value for date selection
    };

    // Bind methods to this instance
    this.openPopupHandler = this.openPopupHandler.bind(this);
    this.closePopupHandler = this.closePopupHandler.bind(this);
  }

  // Method to handle opening the popup with specific track details
  openPopupHandler = (item) => {
    this.setState({
        ContentId: item.track.id, // Set the track ID
        name: item.track.name, // Set the track name
        GamemodeFlags: item.GamemodeFlags, // Set game mode flags
        ModifierFlags: item.ModifierFlags, // Set modifier flags
        date: item.date, // Set the date
        showPopup: true, // Show the popup
        pressedButton: item.pressedButton, // Identify which button triggered the popup
    });
  };

  // Method to close the popup and reset the relevant state
  closePopupHandler = () => {
    this.setState({
      showPopup: false, // Hide the popup
      track: null, // Reset track details
      GamemodeFlags: null, // Reset game mode flags
      ModifierFlags: null, // Reset modifier flags
      date: null, // Reset date
    });
  };

  // Render method to display the component
  render() {
    return (
        <div className='pippo' style={{ backgroundImage: this.state.bg }}>
            {/* Check if the popup should be displayed */}
            {this.state.showPopup && (
                <Modal show={this.state.showPopup} handleClose={this.closePopupHandler}>
                    {/* Render LoadData component inside the modal with necessary props */}
                    <LoadData
                        name={this.state.name}
                        ContentId={this.state.ContentId}
                        GamemodeFlags={this.state.GamemodeFlags}
                        ModifierFlags={this.state.ModifierFlags}
                        date={this.state.date}
                        FetchUserEntries={this.props.steam_id}
                        pressedButton={this.state.pressedButton}
                    />
                </Modal>
            )}

           
            
        </div>
    );

    } 
  }
    export default Grid;


    
    //  <div className="container-lg">
    //             <div className="row">
    //                 {/* Map over the tracks array and create a card for each track */}
    //                 {this.props.tracks.map((item, index) => (
    //                     <div
    //                         key={index}
    //                         style={{ height: "300px", width: "400px", margin: "5px" }}
    //                         className="col-xl-4 col-md-6 col-xxl-3"
    //                     >
    //                         <Card>
    //                             <Card.Body>
    //                                 <Card.Title>{item.name}</Card.Title>
    //                                 <div className="row">
    //                                     {/* Left column: Labels for the track stats */}
    //                                     <div className="col-sm-6">
    //                                         <p>Leaderboard date</p>
    //                                         <p>Best race times</p>
    //                                         <p>Best lap times</p>
    //                                         <p>Best race times (purist)</p>
    //                                         <p>Best lap times (purist)</p>
    //                                     </div>

    //                                     {/* Right column: Interactive inputs and buttons */}
    //                                     <div className="col-sm-6">
    //                                         {/* If a date is selected, show the input field */}
    //                                         {this.state.date_array[index] != null && (
    //                                             <p>
    //                                                 <input
    //                                                     className="LeaderboardDate"
    //                                                     type="month"
    //                                                     id="start"
    //                                                     name="start"
    //                                                     defaultValue={this.state.date_array[index]}
    //                                                     onChange={(event) => {
    //                                                         // Update the date_array state with the new value
    //                                                         const tmp = [...this.state.date_array];
    //                                                         tmp[index] = event.target.value;

    //                                                         // If the input is cleared, set the value to null
    //                                                         if (event.target.value === "") {
    //                                                             tmp[index] = null;
    //                                                         }
    //                                                         this.setState({ date_array: tmp });
    //                                                     }}
    //                                                 />
    //                                             </p>
    //                                         )}

    //                                         {/* If no date is selected, show the dropdown menu */}
    //                                         {this.state.date_array[index] === null && (
    //                                             <p>
    //                                                 <select
    //                                                     defaultValue={1}
    //                                                     onChange={(event) => {
    //                                                         if (event.target.value === "2") {
    //                                                             const tmp = [...this.state.date_array];
    //                                                             tmp[index] = "";
    //                                                             this.setState({ date_array: tmp });
    //                                                         }
    //                                                     }}
    //                                                 >
    //                                                     <option value="1">All time</option>
    //                                                     <option value="2">Pick a date</option>
    //                                                 </select>
    //                                             </p>
    //                                         )}

    //                                         {/* Buttons to view track data */}
    //                                         <p>
    //                                             <Button
    //                                                 className="BestRaceTimes"
    //                                                 variant="primary"
    //                                                 size="sm"
    //                                                 onClick={() =>
    //                                                     this.openPopupHandler({
    //                                                         pressedButton: "Best Race Times",
    //                                                         date: this.state.date_array[index],
    //                                                         GamemodeFlags: 1,
    //                                                         ModifierFlags: 0,
    //                                                         track: item,
    //                                                     })
    //                                                 }
    //                                             >
    //                                                 view
    //                                             </Button>
    //                                         </p>
    //                                         <p>
    //                                             <Button
    //                                                 className="BestLapTimes"
    //                                                 variant="primary"
    //                                                 size="sm"
    //                                                 onClick={() =>
    //                                                     this.openPopupHandler({
    //                                                         pressedButton: "Best Lap Times",
    //                                                         date: this.state.date_array[index],
    //                                                         GamemodeFlags: 2,
    //                                                         ModifierFlags: 0,
    //                                                         track: item,
    //                                                     })
    //                                                 }
    //                                             >
    //                                                 view
    //                                             </Button>
    //                                         </p>
    //                                         <p>
    //                                             <Button
    //                                                 className="BestRaceTimesPurist"
    //                                                 variant="primary"
    //                                                 size="sm"
    //                                                 onClick={() =>
    //                                                     this.openPopupHandler({
    //                                                         pressedButton: "Best Race Times Purist",
    //                                                         date: this.state.date_array[index],
    //                                                         GamemodeFlags: 1,
    //                                                         ModifierFlags: 2,
    //                                                         track: item,
    //                                                     })
    //                                                 }
    //                                             >
    //                                                 view
    //                                             </Button>
    //                                         </p>
    //                                         <p>
    //                                             <Button
    //                                                 className="BestLapTimesPurist"
    //                                                 variant="primary"
    //                                                 size="sm"
    //                                                 onClick={() =>
    //                                                     this.openPopupHandler({
    //                                                         pressedButton: "Best Lap Times Purist",
    //                                                         date: this.state.date_array[index],
    //                                                         GamemodeFlags: 2,
    //                                                         ModifierFlags: 2,
    //                                                         track: item,
    //                                                     })
    //                                                 }
    //                                             >
    //                                                 view
    //                                             </Button>
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                             </Card.Body>
    //                         </Card>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>

    