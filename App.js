import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  measure,
  useAnimatedRef,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {View, Text, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import React from 'react';
import MaskedView from '@react-native-community/masked-view';

export default function AnimatedStyleUpdateExample(props) {
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const aref = useAnimatedRef();

  const dimensions = Dimensions.get('window');

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (ctx) => {
      ctx.dimensions = measure(aref);
    },
    onActive: (ctx) => {
      scaleX.value = withSpring(dimensions.width / ctx.dimensions.width, {
        // overshootClamping: true,
      });
      scaleY.value = withSpring(dimensions.height / ctx.dimensions.height, {
        // overshootClamping: true,
      });
    },
    onEnd: (_) => {},
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: interpolate(
            scaleX.value,
            [1, 200],
            [1, 200],
            Extrapolate.CLAMP,
          ),
        },
        {
          scaleY: interpolate(
            scaleY.value,
            [1, 200],
            [1, 200],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scaleX.value, [1, 2], [0, 1], Extrapolate.CLAMP),
    };
  });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <MaskedView
        style={{flex: 1, flexDirection: 'row', height: '100%'}}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Animated.View
              ref={aref}
              style={[
                {
                  backgroundColor: 'black',
                  width: 50,
                  height: 50,
                },
                style,
              ]}
            />
          </View>
        }>
        <TapGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: 'tomato',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <Animated.Text
              style={[
                {
                  color: '#000',
                  fontSize: 60,
                },
                textStyle,
              ]}>
              HELLO BABY
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
      </MaskedView>
    </View>
  );
}
