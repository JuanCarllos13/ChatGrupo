import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function ModalNewRoom({ setVisibly, setUpdateModal }) {
  const [roomName, setRoomName] = useState("");

  const user = auth().currentUser.toJSON();

  function handleButtonCreate() {
    if (roomName === "") {
      return;
    }

    //Deixar apenas cada user criar 4 sala
    firestore()
      .collection("MESSAGE_THREADS")
      .get()
      .then((snapshot) => {
        let myTreads = 0;

        snapshot.docs.map((docItem) => {
          if (docItem.data().owner === user.uid) {
            myTreads += 1;
          }
        });

        if (myTreads >= 4) {
          Alert.alert("Você já atingiu o limite de sala");
        } else {
          createRoom();
        }
      });
  }

  function createRoom() {
    firestore()
      .collection("MESSAGE_THREADS")
      .add({
        name: roomName,
        owner: user.uid,
        lastMessage: {
          text: `Grupo ${roomName} criado. Bem vindo(a)!`,
          createdAt: firestore.FieldValue.serverTimestamp(),
        },
      })
      .then((docRef) => {
        docRef
          .collection("MESSAGES")
          .add({
            text: `Grupo ${roomName} criado. Bem vindo(a)!`,
            createdAt: firestore.FieldValue.serverTimestamp(),
            system: true,
          })
          .then(() => {
            setUpdateModal();
            setVisibly();
          });
      })
      .catch((err) => {
        console.log("error", err);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisibly}>
        <View style={styles.modal} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>Criar um novo Grupo?</Text>

        <TextInput
          value={roomName}
          onChangeText={setRoomName}
          placeholder="Nome para a sua sala"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.buttonCreate}
          onPress={handleButtonCreate}
        >
          <Text style={styles.buttonText}>Criar sala</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(34, 34, 34, 0.4)",
  },
  modal: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  title: {
    marginTop: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
  },
  input: {
    borderRadius: 4,
    height: 45,
    backgroundColor: "#DDD",
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  buttonCreate: {
    borderRadius: 4,
    backgroundColor: "#2e54d4",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
});
