import { Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, StyleSheet, Image, Dimensions, FlatList } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

// import { Image } from 'expo-image';

import Pic from '../assets/image.png';

//https://api.openweathermap.org/data/3.0/onecall?&units=metric&exclude=minutely&appid=f5a2eb40a4c7bf948600af5f7f7d7cd6
//eb87d123c070ba2c7cf6a7006a98f912
// const OpenWeatherKey = 'eb87d123c070ba2c7cf6a7006a98f912';
// let url = 'https://api.openweathermap.org/data/3.0/onecall?lat=14.5846&lon=121.0708&units=metric&exclude=minutely&appid=${OpenWeatherKey}'

const url = 'https://api.openweathermap.org/data/3.0/onecall?lat=14.5846&lon=121.0708&units=metric&appid=f5a2eb40a4c7bf948600af5f7f7d7cd6'

export default function Weather(){
    // const [ forecast, setForecast ] = useState(null);
    const [ refreshing, setfreshing ] = useState(false);
    const [ currentTemp, setCurrentTemp ] = useState(null);
    const [ currentDescription, setCurrentDescription] = useState(null);
    const [ currlat, setCurrLat ] = useState(null);
    const [ currlon, setCurrLon ] = useState(null);
    const [ feelslike, setFeelsLike ] = useState(null);
    const [ feelsHourlylike, setHourlyFeelsLike ] = useState(null);
    const [ currhumidity, setCurrHumidity ] = useState(null);
    const [ hourly, setHourly ] = useState(null);
    const [ hourlyDesc, setHourlyDesc ]= useState(null);


    useEffect(() => {
        loadForecast();
      }, []); // Empty dependency array means this runs only once when the component mounts



    const loadForecast = async () => {
    
        //ask for permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
            Alert.alert('Persmission to access location was denied');
            return;
        }


        //get the current location
        const location = await Location.getCurrentPositionAsync();
        
        //fetch the weather data from openweathermap api
        const response = await fetch(url);
        console.log("response.ok :" + response.ok);        
        console.log("response.status :" + response.status);    
        const data = await response.json();


        if (response.status === 200){
            // setForecast(data);
            // Access current.temp from the data object
            setCurrentTemp(data.current.temp);
            setCurrentDescription(data.current.weather[0].description);
            setWeatherIcon(data.current.weather[0].icon);
            setCurrHumidity(data.current.humidity);
            setFeelsLike(data.current.feels_like);
            setCurrLat(data.lat);
            setCurrLon(data.lon);

            setHourly(data.hourly);
            setHourlyFeelsLike(data.hourly[0].feels_like);
            setHourlyDesc(data.hourly[0].weather[0].description); 
            


            console.log('Fetch data successful');
        }
        else{
            console.log(data);
            return;
        }

        setfreshing(false);

    }

    
    // if(!forecast){
    //         <ActivityIndicator size='large' color='#C84B31'/>    
    // }

    console.log("currentTemp " + currentTemp);
    console.log("currentDescription " + currentDescription);
    console.log("feelslike " + feelslike);
    console.log("feelsHourlylike " + feelsHourlylike);
    console.log("hourlyDesc " + hourlyDesc);
    // const currentDescriptipon = forecast.current.weather[0];
    // console.log("forecast.current.weather[0] " + forecast.current.weather[0]);

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* RefreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => loadForecast()}
                />
            } */}
            <Text style={{marginTop:50}}/>

            <Text style={styles.title}>
                Current Weather
            </Text>

            <Text style={{alignItems:'center', textAlign:'center', fontSize:15, color:'blue'}}>
                Your Location {currlat + '  ' + currlon}
            </Text>

            <View style={styles.current}>
                <Image
                    style={styles.largeIcon}
                    // source={{uri:'https://openweathermap.org/img/wn/10d@2x.png'}}
                    // source="https://openweathermap.org/img/wn/10d@2x.png"
                    // source={Pic}
                    source={{ uri: 'http://openweathermap.org/img/wn/10n@2x.png' }}
                    // contentFit="cover"
                />

                <Text style={styles.currentTemperature}>
                    {Math.round(currentTemp)}°C
                </Text>

            </View>

            <Text style={styles.currentDescriptionStyle}>
                    {currentDescription}
            </Text>

            <View style={styles.extraInfo}>
                <View style={styles.info}>
                    <Image
                        source={require('../assets/temp.png')}
                        style={{width:50, height:50, borderRadius:40/2, marginLeft:50}}
                    />
                    <Text style={styles.textTitle}>
                        {feelslike}°C
                    </Text>
                    <Text style={styles.textTitle}>
                        Feels Like
                    </Text>
                </View>
                <View style={styles.info}>
                    <Image
                        source={require('../assets/humidity.png')}
                        style={{width:50, height:50, borderRadius:40/2, marginLeft:50}}
                    />
                    <Text style={styles.textTitle}>
                        {currhumidity}
                    </Text>
                    <Text style={styles.textTitle}>
                        humidity
                    </Text>
                </View>
            </View>

            <View>
                <Text style={styles.subtitle}>
                    Hourly Forecast
                </Text>
            </View>


            <FlatList
                horizontal={true}
                data={hourly}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(hour) => {
                    const weather = hour.item.weather[0];
                    var dt = new Date(hour.item.dt * 1000)
                    return(
                        <View style={styles.hour}>
                            <Text style={{fontWeight:'bold', color:'#346751'}}>
                                {dt.toLocaleTimeString().replace(/:\d+ /, ' ')}

                            </Text>
                            <Text style={{fontWeight:'bold', color:'#346751'}}>
                                {Math.round(feelsHourlylike)}°C
                            </Text>

                            <Image
                                style={styles.smallicon}
                                  source={{uri:'http://openweathermap.org/img/wn/04d@2x.png'}}
                            />

                            <Text style={{fontWeight:'bold', olor:'#346751'}}>
                                {hourlyDesc}
                            </Text>
                        </View>
                    )
                }}
            />

            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#ECDBBA'
    },
    title:{
        textAlign:'center',
        fontSize:36,
        fontWeight: 'bold',
        color: '#C84B31'
    },
    current:{
        flexDirection: 'row',
        alignItems:'center',
        alignContent:'center'
    },
    largeIcon:{
        marginTop: 20,
        marginLeft:40,
        width: 150,
        height: 150,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: '#C84B31',
        //
        // backgroundColor: '#0553',
    },
    currentTemperature:{
        fontSize:35,
        fontWeight:'bold',
        // textAlign:'right'
        marginLeft: 50,
    },
    currentDescriptionStyle:{
        // width:100,
        // textAlign:'center',
        fontWeight:'200',
        fontSize:24,
        marginTop: 20,
        // marginLeft: 70,
        alignSelf: 'center',
        marginBottom:10,
    },
    info:{
        width: Dimensions.get('screen').width/2.5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding:10,
        borderRadius:10,
        justifyContent:'center'
    },
    extraInfo:{
        flexDirection:'row',
        marginTop:10,
        justifyContent:'space-between',
        padding:10
    },
    textTitle:{
        fontSize:20,
        color:'#fff',
        textAlign:'center'
    },
    subtitle:{
        fontSize:24,
        marginVertical:12,
        marginLeft:7,
        color:'#C84b31',
        fontWeight:'bold'
    },
    hour:{
        padding:6,
        alignItems: 'center',

    },
    smallicon:{
        width:50,
        height:50,

    }

})