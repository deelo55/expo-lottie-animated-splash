import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  return (
    <AnimatedAppLoader>
      <MainScreen />
    </AnimatedAppLoader>
  );
}

import { ReactNode } from "react";

function AnimatedAppLoader({ children }: { children: ReactNode }) {
  return <AnimatedSplashScreen>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children }: { children: ReactNode }) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      setTimeout(() => {
        setAnimationComplete(true);
      }, 2000);
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              zIndex: 1,

              position: "absolute",
              top: 400,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <LottieView
              loop={false}
              autoPlay={true}
              style={{
                width: "50%",
                height: "50%",
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("./assets/splash.json")}
            />
          </View>

          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
            }}
            source={require("./assets/levity-splash.jpg")}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </View>
      )}
    </View>
  );
}

function MainScreen() {
  const onReloadPress = useCallback(() => {
    if (Platform.OS === "web") {
      location.reload();
    } else {
      Updates.reloadAsync();
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "plum",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 30,
          marginBottom: 15,
          fontWeight: "bold",
        }}
      >
        Pretty Cool!
      </Text>
      <Button title="Run Again" onPress={onReloadPress} />
    </View>
  );
}
