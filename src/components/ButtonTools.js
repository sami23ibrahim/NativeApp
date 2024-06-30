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
                console.log(`Button ${button.label} does not have a valid onPress function`);
              }
            }}
            style={styles.buttonWrapper}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={button.iconName} size={30} color="white" />
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
    backgroundColor: '#9cacbc',
    padding:3,
    borderRadius: 10,
    marginTop: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,marginTop: 2,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginHorizontal: 25,
  },
  iconContainer: {
    backgroundColor: 'rgba(172, 188, 198, 0.33)',
    borderRadius: 45,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    marginTop: 1,
    textAlign: 'center',
  },
});

export default ButtonTools;
