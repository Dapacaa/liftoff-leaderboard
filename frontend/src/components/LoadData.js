import React from 'react'
import Plot from 'react-plotly.js';
import config from '../../package.json';
console.log(__dirname)
class LoadData extends React.Component{


    async componentDidMount() {
        if (this.first) return; this.first = true;
        this.load_leaderboard(this.state.url,this.state.body);
        
    }



    constructor(props) {
        super(props);
    
        let ModifierFlags = this.props.ModifierFlags;
        let date = this.props.date;
    
        if (date != null) {
            const ar = date.split("-");
            const a = ar.map((val) => Number(val));
            date = `${a[0]}-${a[1]}`;
            ModifierFlags = ModifierFlags + 1;
        }
    
        this.state = {
            url: "/api/unity/v0.5/GetCommunityLeaderboard.php", // Updated URL to use the proxy
            body: JSON.stringify({
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
            response: {},
            num_bins: 50
        };
    
        this.load_leaderboard = this.load_leaderboard.bind(this);

    
    }

    async load_leaderboard(url, body) {
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

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: body,
        redirect: "follow"
    };

    try {
		debugger;
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result)
        this.setState({ data: result });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
}





    render(){
        

        var text=(<></>)
        if ( this.state.data){
        
            

            var xValues=[]
            var yValues=[]
            var json=this.state.data
            
            if (json.AllEntries.length===0){
                return (<p>There is no data to display</p>)
            }
            for(var i=0 ; i<json.AllEntries.length;i++){
                xValues.push(json.AllEntries[i][2])
                yValues.push(json.AllEntries[i][1]/1000)
            }

    

            var avv= yValues.reduce((a, b) => a + b)/yValues.length
            var Average = {
                x: [xValues[0],xValues[xValues.length-1]],
                y: [avv,avv],
                mode: 'lines',
                name: 'Average time'
              };



            

            var dat
            var you_hist
            if (json.UserEntries.length !==0){
                console.log(json.UserEntries)
                var myindex=json.UserEntries[0][2]-1
                

                var position=myindex+1
                var total=yValues.length
                var percentile= 100-parseInt(((total-position)/total)*100)
                var seconds_from1=yValues[myindex]-yValues[0]

                var write=<>{percentile}th</>
                if (percentile===1){
                    write=<>{percentile}st</>
                }
                
                if (percentile===2){
                    write=<>{percentile}nd</>
                }
                if (percentile===3){
                    write=<>{percentile}rd</>
                }


                text=(<div><p>You are in the top <b>{write} percentile </b>
                 and you are in position <b>{position} over {total}</b> participants with score of <b>{yValues[myindex]} Seconds</b>.</p>
                <p>You are <b>{seconds_from1} seconds</b> slower then the first pilot</p></div>)


                you_hist={
                    marker: {
                        color:"red",
                        size: 12 
                
                    },
                    x: [yValues[myindex]],
                    y: [0],
                    mode:"markers",
                    type:"scatter",
                    name: 'You',
                    width: 1
                    
                  }

                dat = [{
                    x: xValues,
                    y: yValues,
                    mode:"markers",
                    type:"scatter",
                    name: 'Racer'
                  },  {
                      marker: {
                          color:"red"
                  
                      },
                      x: [xValues[myindex]],
                      y: [yValues[myindex]],
                      type: 'bar',
                      name: 'You',
                      width: 1
                      
                    }, Average];
            }else{
                dat = [{
                    x: xValues,
                    y: yValues,
                    mode:"markers",
                    type:"scatter"
                  }, Average];
                
            }
            
            
            
            var date=this.props.date
            if (date===null){
                date="All time"
            }

            var layout = {
                xaxis: {title: "Positon"},
                yaxis: {title: "Seconds"},
                title: this.props.pressedButton +" Leaderboard \""+this.props.name +"\" "+date
              
        };              
        

        var nbins=this.state.num_bins/10

        var layout_hist={
            xaxis: {title: "Seconds"},
            yaxis: {title: "Number of Racers"}
        }


        var histogram=[{
            x: yValues,
            type: 'histogram',
           // nbinsx :this.state.num_bins
          xbins:{
                size:nbins
            },
            
            marker: {
                color:"blue",
                line:{
                    width:1
                }
            }
        }]


        if (you_hist){
            histogram.push(you_hist)
        }
    }

        //style={{width:"100%"}}
        return ( <>
        
        { this.state.data &&
        <div>
        <Plot style={{width:"100%"}} data={dat}
        layout={layout}/>
        <div>
        

        <Plot style={{}} data={histogram} layout={layout_hist} />
        <input style={{width:"50%"}} type="range" min={1} max={339*3} 
        onChange={(event)=> this.setState({num_bins:event.target.value})} class="slider" id="myRange"></input>
        <p>Bar size: {this.state.num_bins/10}</p>
        </div>


        </div>
        }

        { !this.state.data &&

        
        <img src='https://i.giphy.com/SYvIZe4FMsLCkt00aZ.webp' alt=""></img>
        }
        {text}

       

    </>)
    }
}


export default LoadData;