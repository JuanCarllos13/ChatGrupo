import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { useNavigation, useIsFocused } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FabButton } from "../../components/FabButton";
import { ModalNewRoom } from "../../components/ModalNewRoom";
import { ChatList } from "../../components/ChatList";

export default function ChatRoom() {
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState(false);
  const [modalVisibly, setModalVisibly] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        navigation.navigate("SignIn");
      })
      .catch(() => {
        console.log("Não possui nenhum usuário");
      });
  }

  async function deleteRoom(roomId) {
    await firestore().collection("MESSAGE_THREADS").doc(roomId).delete();
    setUpdateModal(!updateModal);
  }

  function handleDeleteRoom(ownerId, roomId) {
    if (ownerId !== user?.uid) {
      return;
    }

    Alert.alert("Atenção!", "Você tem certeza que deseja deletar essa sala?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: () => deleteRoom(roomId),
      },
    ]);
  }

  useEffect(() => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    setUser(hasUser);
  }, [isFocused]);

  useEffect(() => {
    let isActive = true;

    function getChats() {
      firestore()
        .collection("MESSAGE_THREADS")
        .orderBy("lastMessage.createdAt", "desc")
        .limit(10)
        .get()
        .then((snapshot) => {
          const threads = snapshot.docs.map((documentos) => {
            return {
              _id: documentos.id,
              name: "",
              lastMessage: { text: "" },
              ...documentos.data(),
            };
          });
          if (isActive) {
            setThreads(threads);
            setLoading(false);
          }
        });
    }

    getChats();

    return () => {
      isActive = false;
    };
  }, [isFocused, updateModal]);

  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <MaterialIcons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <MaterialIcons name="search" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatList
            data={item}
            deleteRoom={() => handleDeleteRoom(item.owner, item._id)}
            userStatus={user}
          />
        )}
      />

      <FabButton setVisibly={() => setModalVisibly(true)} userStatus={user} />

      <Modal visible={modalVisibly} animationType="fade" transparent>
        <ModalNewRoom
          setVisibly={() => setModalVisibly(false)}
          setUpdateModal={() => setUpdateModal(!updateModal)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#2e54D4",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 10,
  },
});
