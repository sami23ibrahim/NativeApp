import React, { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { requestEmailChange } from '../services/EmailChangeService';

export default function EmailChangeComponent() {
    const [oldEmail, setOldEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = async () => {
        setMessage('');
        try {
            await requestEmailChange(oldEmail, newEmail);
            setMessage('Email change request sent successfully.');
        } catch (error) {
            setMessage('Error requesting email change: ' + error.message);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Old Email"
                value={oldEmail}
                onChangeText={setOldEmail}
            />
            <TextInput
                placeholder="New Email"
                value={newEmail}
                onChangeText={setNewEmail}
            />
            <Button title="Change Email" onPress={handleEmailChange} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
}
