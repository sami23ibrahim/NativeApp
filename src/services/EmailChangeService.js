
import { firebase } from '../config/firebase';
async function requestEmailChange(oldEmail, newEmail) {
    try {
        const user = firebase.auth().currentUser;
        console.log('User ID:', user.uid);

        // Create a request document in Firestore
        const requestRef = await firebase.firestore().collection('emailChangeRequests').add({
            uid: user.uid,
            oldEmail: oldEmail,
            newEmail: newEmail,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Request Document ID:', requestRef.id);

        // Send an email to the old email address with a link to confirm
        await sendConfirmationEmailToOldEmail(oldEmail, requestRef.id);

        console.log('Confirmation email sent to old email:', oldEmail);
    } catch (error) {
        console.error('Error requesting email change:', error);
    }
}

async function sendConfirmationEmailToOldEmail(oldEmail, requestId) {
    const confirmationLink = `https://yourapp.com/confirm-email-change?requestId=${requestId}`;
    
    // Replace this with your actual email sending code
    console.log(`Send email to ${oldEmail} with link: ${confirmationLink}`);
    
    // Use Firebase Cloud Functions or any other email sending service to send the email
    // This is a placeholder to simulate sending an email
    await new Promise(resolve => setTimeout(resolve, 1000));
}

export { requestEmailChange };
