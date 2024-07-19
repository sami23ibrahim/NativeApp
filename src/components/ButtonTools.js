// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const ButtonTools = ({ buttons = [] }) => {
//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.container}>
//         {buttons.map((button, index) => (
//           <TouchableOpacity
//             key={index}
//             onPress={() => {
//               if (typeof button.onPress === 'function') {
//                 console.log(`Button ${button.label} pressed`);
//                 button.onPress();
//               } else {
//               }
//             }}
//             style={styles.buttonWrapper}
//           >
//             <View style={styles.iconContainer}>
//               <MaterialCommunityIcons name={button.iconName} size={30} color='rgba(150, 150, 150, 0.93)' /> 
//             </View>
//             {button.label && <Text style={styles.label}>{button.label}</Text>}
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//    backgroundColor: 'black',
//     padding:1,
//     borderRadius: 10,
//     marginTop: 2,
//   },
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,marginTop: 0,marginLeft: 15
//   },
//   buttonWrapper: {
//     alignItems: 'center',
//     marginHorizontal: 24,
//   },
//   iconContainer: {
//      backgroundColor: 'black',
//     borderRadius: 45,
//     padding: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   label: {
//     color: 'rgba(150, 150, 150, 0.83)',
//     marginTop: 1,
//     textAlign: 'center',
//   },
// });

// export default ButtonTools;

// ButtonTools.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const scale = width / 320;

function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const ButtonTools = ({ buttons = [] }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (typeof button.onPress === 'function') {
                console.log(`Button ${button.label} pressed`);
                button.onPress();
              }
            }}
            style={styles.buttonWrapper}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={button.iconName} 
                size={normalize(30)} 
                color='rgba(150, 150, 150, 0.93)' 
              /> 
            </View>
            {button.label && <Text style={styles.label}>{button.label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'black',
    padding: normalize(1),
    borderRadius: normalize(10),
    marginTop: normalize(1),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(15),
    marginTop: normalize(0),
    marginLeft: normalize(15)
  },
  buttonWrapper: {
    alignItems: 'center',
    marginHorizontal: normalize(17),
  },
  iconContainer: {
    backgroundColor: 'black',
    borderRadius: normalize(45),
    padding: normalize(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(150, 150, 150, 0.83)',
    marginTop: normalize(1),
    textAlign: 'center',
    fontSize: normalize(12),
  },
});

export default ButtonTools;
