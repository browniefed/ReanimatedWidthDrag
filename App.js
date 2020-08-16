import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Easing,
  useAnimatedGestureHandler,
  measure,
  useAnimatedRef,
} from 'react-native-reanimated';
import {View, Button} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import React from 'react';

export default function AnimatedStyleUpdateExample(props) {
  const randomWidth = useSharedValue(50);
  const aref = useAnimatedRef();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.width = measure(aref).width;
    },
    onActive: (event, ctx) => {
      randomWidth.value = ctx.width + event.translationX;
    },
    onEnd: (_) => {
      randomWidth.value = withSpring(50);
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      width: randomWidth.value,
    };
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          ref={aref}
          style={[
            {
              height: 80,
              backgroundColor: 'black',
              margin: 30,
            },
            style,
          ]}
        />
      </PanGestureHandler>
      <Animated.View
        style={[
          {
            height: 80,
            backgroundColor: 'black',
            margin: 30,
          },
          style,
        ]}
      />
      <Animated.View
        style={[
          {
            height: 80,
            backgroundColor: 'black',
            margin: 30,
          },
          style,
        ]}
      />
    </View>
  );
}
