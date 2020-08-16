import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  measure,
  useAnimatedRef,
} from 'react-native-reanimated';
import {View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import React from 'react';

const Boop = ({width}) => {
  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  return (
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
  );
};

export default function AnimatedStyleUpdateExample(props) {
  const width = useSharedValue(50);
  const aref = useAnimatedRef();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      const measuredWidth = measure(aref).width;
      ctx.width = measuredWidth;
    },
    onActive: (event, ctx) => {
      width.value = ctx.width + event.translationX;
    },
    onEnd: (_) => {
      width.value = withSpring(50);
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
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
      <Boop width={width} />
      <Boop width={width} />
    </View>
  );
}
