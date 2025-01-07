// Importing React library and Plotly.js for data visualization
import React from 'react'
import Plot from 'react-plotly.js';

// Importing the package.json configuration file
import config from '../../package.json';

// Log the current directory for debugging purposes
console.log(__dirname)

// Define a React component for loading and displaying leaderboard data
class LoadData extends React.Component {

    // This function is called once the component is mounted to the DOM
    async componentDidMount() {
        if (this.first) return; // Prevent repeated calls
        this.first = true; // Mark as initialized
        this.load_leaderboard(this.state.url, this.state.body); // Fetch leaderboard data
    }

    // Constructor to initialize the component's state and bind methods
    constructor(props) {
        super(props); // Call parent constructor

        let ModifierFlags = this.props.ModifierFlags; // Get initial modifier flags from props
        let date = this.props.date; // Get the date from props

        // If a date is provided, format it and adjust ModifierFlags
        if (date != null) {
            const ar = date.split("-"); // Split date into parts
            const a = ar.map((val) => Number(val)); // Convert strings to numbers
            date = `${a[0]}-${a[1]}`; // Format date as YYYY-MM
            ModifierFlags = ModifierFlags + 1; // Increment ModifierFlags
        }

        // Initialize the component's state
        this.state = {
            url: "/api/unity/v0.5/GetCommunityLeaderboard.php", // API endpoint
            body: JSON.stringify({ // Prepare request payload
                LeaderboardKeyword: {
                    ContentId: this.props.ContentId,
                    GamemodeFlags: this.props.GamemodeFlags,
                    ModifierFlags: ModifierFlags,
                    Timestamp: date
                },
                PlatformName: "steam",
                FetchAllEntries: true,
                FetchUserEntries: [this.props.FetchUserEntries]
            }),
            response: {}, // Placeholder for API response
            num_bins: 50 // Default histogram bin size
        };

        // Bind the load_leaderboard method to this component
        this.load_leaderboard = this.load_leaderboard.bind(this);
    }

    // Method to fetch leaderboard data from the server
    async load_leaderboard(url, body) {
        // Define request headers
        const myHeaders = new Headers({
            "Host": "liftoff-pro-service.westeurope.cloudapp.azure.com",
            "User-Agent": "UnityPlayer/2022.3.50f1 (UnityWebRequest/1.0, libcurl/8.5.0-DEV)",
            "Accept": "*/*",
            "Accept-Encoding": "deflate, gzip",
            "RequestId": "0",
            "GameVersion": "1.6.8",
            "Application": "liftoff-fpv",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Unity-Version": "2022.3.50f1"
        });

        // Set up the request options
        const requestOptions = {
            method: "POST", // HTTP method
            headers: myHeaders, // Request headers
            body: body, // Request body
            redirect: "follow" // Allow redirects
        };

        try {
            debugger; // Debugging breakpoint
            const response = await fetch(url, requestOptions); // Fetch API response
            if (!response.ok) { // Check for HTTP errors
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json(); // Parse JSON response
            console.log(result); // Log the result for debugging
            this.setState({ data: result }); // Update state with response data
        } catch (error) {
            console.error("Error fetching leaderboard:", error); // Handle errors
        }
    }

    // Render the component's UI
    render() {
        var text = (<></>); // Placeholder for additional information

        // If data is loaded, process it for visualization
        if (this.state.data) {
            var xValues = []; // Positions on the leaderboard
            var yValues = []; // Scores in seconds
            var json = this.state.data;

            // If no data is available, display a message
            if (json.AllEntries.length === 0) {
                return (<p>There is no data to display</p>);
            }

            // Process data entries
            for (var i = 0; i < json.AllEntries.length; i++) {
                xValues.push(json.AllEntries[i][2]); // Extract positions
                yValues.push(json.AllEntries[i][1] / 1000); // Extract scores
            }

            // Calculate the average score
            var avv = yValues.reduce((a, b) => a + b) / yValues.length;
            var Average = {
                x: [xValues[0], xValues[xValues.length - 1]], // Plot start and end
                y: [avv, avv], // Horizontal line for average
                mode: 'lines',
                name: 'Average time'
            };

            var dat; // Data for scatter plot
            var you_hist; // Data for histogram if user entry is available

            // If user-specific data is available, process it
            if (json.UserEntries.length !== 0) {
                var myindex = json.UserEntries[0][2] - 1; // User's position in data
                var position = myindex + 1; // User's ranking
                var total = yValues.length; // Total number of entries
                var percentile = 100 - parseInt(((total - position) / total) * 100); // Calculate percentile
                var seconds_from1 = yValues[myindex] - yValues[0]; // Difference from first place

                // Display user's percentile and position
                var write = <>{percentile}th</>;
                if (percentile === 1) write = <>{percentile}st</>;
                if (percentile === 2) write = <>{percentile}nd</>;
                if (percentile === 3) write = <>{percentile}rd</>;

                text = (
                    <div>
                        <p>You are in the top <b>{write} percentile </b>
                            and you are in position <b>{position} over {total}</b> participants with score of <b>{yValues[myindex]} Seconds</b>.
                        </p>
                        <p>You are <b>{seconds_from1} seconds</b> slower than the first pilot.</p>
                    </div>
                );

                // Highlight user's position on the histogram
                you_hist = {
                    marker: {
                        color: "red",
                        size: 12
                    },
                    x: [yValues[myindex]],
                    y: [0],
                    mode: "markers",
                    type: "scatter",
                    name: 'You',
                    width: 1
                };

                dat = [{
                    x: xValues,
                    y: yValues,
                    mode: "markers",
                    type: "scatter",
                    name: 'Racer'
                }, {
                    marker: {
                        color: "red"
                    },
                    x: [xValues[myindex]],
                    y: [yValues[myindex]],
                    type: 'bar',
                    name: 'You',
                    width: 1
                }, Average];
            } else {
                // Default scatter plot data
                dat = [{
                    x: xValues,
                    y: yValues,
                    mode: "markers",
                    type: "scatter"
                }, Average];
            }

            // Display the leaderboard's title and axis labels
            var date = this.props.date;
            if (date === null) {
                date = "All time";
            }
            var layout = {
                xaxis: { title: "Position" },
                yaxis: { title: "Seconds" },
                title: `${this.props.pressedButton} Leaderboard "${this.props.name}" ${date}`
            };

            // Histogram layout and bin size
            var nbins = this.state.num_bins / 10;
            var layout_hist = {
                xaxis: { title: "Seconds" },
                yaxis: { title: "Number of Racers" }
            };

            // Create histogram data
            var histogram = [{
                x: yValues,
                type: 'histogram',
                xbins: { size: nbins },
                marker: {
                    color: "blue",
                    line: { width: 1 }
                }
            }];
            if (you_hist) histogram.push(you_hist);
        }

        // Render the plots and controls
        return (
            <>
                {this.state.data &&
                    <div>
                        <Plot style={{ width: "100%" }} data={dat} layout={layout} />
                        <div>
                            <Plot style={{}} data={histogram} layout={layout_hist} />
                            <input style={{ width: "50%" }} type="range" min={1} max={339 * 3}
                                onChange={(event) => this.setState({ num_bins: event.target.value })} class="slider" id="myRange"></input>
                            <p>Bar size: {this.state.num_bins / 10}</p>
                        </div>
                    </div>
                }
                {!this.state.data &&
                    <img src='https://i.giphy.com/SYvIZe4FMsLCkt00aZ.webp' alt=""></img>
                }
                {text}
            </>
        );
    }
}

export default LoadData;
