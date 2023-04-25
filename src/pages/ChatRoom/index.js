import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FabButton } from "../../components/FabButton";

export default function ChatRoom() {
  const [modalVisibly, setModalVisibly] = useState(false)
  const navigation = useNavigation();

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate("SignIn");
      })
      .catch(() => {
        console.log("Não possui nenhum usuário");
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          <TouchableOpacity onPress={handleSignOut}>
            <MaterialIcons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <FabButton setVisibly={() => setModalVisibly(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
