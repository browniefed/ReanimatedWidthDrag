import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  measure,
  useAnimatedRef,
  interpolate,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import {View, Text, Dimensions, Image} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import React from 'react';
import MaskedView from '@react-native-community/masked-view';

import Trash from './trashcan.png';

export default function AnimatedStyleUpdateExample(props) {
  const trashRef = useAnimatedRef();
  const fromRef = useAnimatedRef();

  const move = useSharedValue({x: 0, y: 0});
  const scaleValue = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.to = measure(trashRef);
      ctx.from = measure(fromRef);
    },
    onEnd: (event, context) => {
      const y = context.from.y * -1 + context.to.height;
      scaleValue.value = context.from.y * -1 + context.to.height;

      move.value = {
        x: context.to.x - context.from.x - context.to.width / 4,
        y: context.from.y * -1 + context.to.height,
      };
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(move.value.x, {
            duration: 300,
          }),
        },
        {
          translateY: withTiming(move.value.y, {
            duration: 200,
          }),
        },
        {
          scale: withSpring(
            interpolate(
              move.value.y,
              [0, scaleValue.value + 10, scaleValue.value],
              [1, 0.2, 0],
              Extrapolate.CLAMP,
            ),
          ),
        },
      ],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <Animated.Image
        ref={trashRef}
        source={Trash}
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
        }}
      />
      <TapGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          ref={fromRef}
          style={[
            {
              position: 'absolute',
              bottom: 40,
              left: 20,
            },
          ]}>
          <Animated.Text
            style={[
              {color: '#FFF', backgroundColor: 'tomato', padding: 5},
              style,
            ]}>
            Go To Trash
          </Animated.Text>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
}
