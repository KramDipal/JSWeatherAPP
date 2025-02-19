import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// import Weather from './src/location';
import Weather from './src/location';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();
export default function App() {

  const [loaded,error] = useFonts({
    'BebasNeue-Regular':require('./assets/fonts/BebasNeue-Regular.ttf'),
    'DeliciousHandrawn-Regular':require('./assets/fonts/DeliciousHandrawn-Regular.ttf'),
  });

  useEffect(()=>{
    if(loaded || error){
      SplashScreen.hideAsync();
    }
  },[loaded,error])
  if(!loaded && !error) { return null}



  return (
    <View style={styles.container}>
      <Weather/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
