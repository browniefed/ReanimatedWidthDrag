import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  measure,
  withTiming,
  useAnimatedRef,
  Easing,
} from 'react-native-reanimated';
import {View, Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import React from 'react';

const THRESHOLD = 120;

export default function AnimatedStyleUpdateExample(props) {
  const position = useSharedValue(0);
  const dragging = useSharedValue(false);
  const dimensions = Dimensions.get('window');

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.position = position.value;
    },
    onActive: (event, ctx) => {
      if (Math.abs(event.translationY) >= 30) {
        dragging.value = true;
      }
      if (dragging.value) {
        position.value = ctx.position + event.translationY;
      }
    },
    onEnd: (event) => {
      const topValue = -1 * dimensions.height + 120;
      if (event.translationY < -THRESHOLD && event.translationY < 0) {
        position.value = withTiming(topValue, {
          duration: 300,
        });
      } else if (event.translationY >= THRESHOLD && event.translationY > 0) {
        position.value = withSpring(0);
      } else {
        if (position.value < -THRESHOLD) {
          position.value = withTiming(topValue, {
            duration: 150,
          });
        } else {
          position.value = withSpring(0);
        }
      }
      dragging.value = false;
    },
  });

  const dragStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: position.value,
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
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            {
              height: '100%',
              backgroundColor: 'black',
              width: '100%',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              position: 'absolute',
              top: dimensions.height - 80,
              left: 0,
              right: 0,
            },
            dragStyle,
          ]}>
          <View
            style={{
              alignItems: 'center',
              padding: 10,
            }}>
            <View
              style={{
                backgroundColor: '#FFF',
                width: '25%',
                height: 5,
                borderRadius: 5,
              }}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
