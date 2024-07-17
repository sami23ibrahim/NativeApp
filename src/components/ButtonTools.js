import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ButtonTools = ({ buttons = [] }) => {
  console.log('ButtonTools received buttons:', buttons);
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
              } else {
              }
            }}
            style={styles.buttonWrapper}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={button.iconName} size={30} color='rgba(150, 150, 150, 0.93)' /> 
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
    padding:1,
    borderRadius: 10,
    marginTop: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,marginTop: 0,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  iconContainer: {
     backgroundColor: 'black',
    borderRadius: 45,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(150, 150, 150, 0.83)',
    marginTop: 1,
    textAlign: 'center',
  },
});

export default ButtonTools;


