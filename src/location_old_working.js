import { Text, View, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl, StyleSheet, Image, Dimensions, FlatList, Alert } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

const OpenWeatherKey = 'f5a2eb40a4c7bf948600af5f7f7d7cd6'; // Replace with your actual API key

export default function Weather() {
    const [refreshing, setRefreshing] = useState(false);
    const [currentTemp, setCurrentTemp] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState(null);
    const [currLat, setCurrLat] = useState(null);
    const [currLon, setCurrLon] = useState(null);
    const [feelsLike, setFeelsLike] = useState(null);
    const [feelsHourlyLike, setHourlyFeelsLike] = useState(null);
    const [currHumidity, setCurrHumidity] = useState(null);
    const [hourly, setHourly] = useState(null);
    const [hourlyDesc, setHourlyDesc] = useState(null);
    const [ timeZone, setTimeZone ] = useState(null);

    useEffect(() => {
        // loadForecast();
    }, []);

    const loadForecast = async () => {
        try {
            // Ask for permission to access location
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            // Get the current location
            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;

            // Create the dynamic URL
            const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${OpenWeatherKey}`;

            // const url = 'https://api.openweathermap.org/data/3.0/onecall?lat=14.5846&lon=121.0708&units=metric&appid=eb87d123c070ba2c7cf6a7006a98f912'

            // Fetch the weather data from OpenWeatherMap API
            const response = await fetch(url);
            const data = await response.json();

            if (response.status === 200) {
                // Set state variables with the fetched data
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
                setTimeZone(data.timezone);

                console.log('Fetch data successful');
            } else {
                console.log(data);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadForecast();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Text style={{ marginTop: 50 }} />

                <Text style={styles.title}>Current Weather</Text>

                <Text style={{ alignItems: 'center', textAlign: 'center', fontSize: 15, color: 'blue' }}>
                    Your Location {currLat} {currLon}
                </Text>

                <Text style={{fontSize:20, fontWeight:'bold', alignItems:'center', textAlign:'center'}}>
                    {timeZone}
                </Text>

                <View style={styles.current}>
                    <Image
                        style={styles.largeIcon}
                        source={{ uri: `http://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
                    />
                    <Text style={styles.currentTemperature}>{Math.round(currentTemp)}°C</Text>
                </View>

                <Text style={styles.currentDescriptionStyle}>{currentDescription}</Text>

                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image
                            source={require('../assets/temp.png')}
                            style={{ width: 50, height: 50, borderRadius: 40 / 2, marginLeft: 50 }}
                        />
                        <Text style={styles.textTitle}>{feelsLike}°C</Text>
                        <Text style={styles.textTitle}>Feels Like</Text>
                    </View>
                    <View style={styles.info}>
                        <Image
                            source={require('../assets/humidity.png')}
                            style={{ width: 50, height: 50, borderRadius: 40 / 2, marginLeft: 50 }}
                        />
                        <Text style={styles.textTitle}>{currHumidity}</Text>
                        <Text style={styles.textTitle}>Humidity</Text>
                    </View>
                </View>

                <View>
                    <Text style={styles.subtitle}>Hourly Forecast</Text>
                </View>

                <FlatList
                    horizontal={true}
                    data={hourly}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        const weather = item.weather[0];
                        var dt = new Date(item.dt * 1000);
                        return (
                            <View style={styles.hour}>
                                <Text style={{ fontWeight: 'bold', color: '#346751' }}>
                                    {dt.toLocaleTimeString().replace(/:\d+ /, ' ')}
                                </Text>
                                <Text style={{ fontWeight: 'bold', color: '#346751' }}>
                                    {Math.round(item.feels_like)}°C
                                </Text>

                                <Image
                                    style={styles.smallicon}
                                    source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
                                />

                                <Text style={{ fontWeight: 'bold', color: '#346751' }}>
                                    {weather.description}
                                </Text>
                            </View>
                        );
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ECDBBA',
    },
    title: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#C84B31',
    },
    current: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    largeIcon: {
        marginTop: 20,
        marginLeft: 40,
        width: 150,
        height: 150,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: '#C84B31',
    },
    currentTemperature: {
        fontSize: 35,
        fontWeight: 'bold',
        marginLeft: 50,
    },
    currentDescriptionStyle: {
        fontWeight: '200',
        fontSize: 24,
        marginTop: 20,
        alignSelf: 'center',
        marginBottom: 10,
    },
    info: {
        width: Dimensions.get('screen').width / 2.5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
    },
    extraInfo: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'space-between',
        padding: 10,
    },
    textTitle: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        marginVertical: 10,
        marginLeft: 7,
        color: '#C84b31',
        fontWeight: 'bold',
    },
    hour: {
        padding: 6,
        alignItems: 'center',
    },
    smallicon: {
        width: 50,
        height: 50,
    },
});
