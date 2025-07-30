import FloatingActionMenu from "@/components/FloatingAction";
import { View } from "react-native";

export default function CreateAction() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> 
          <FloatingActionMenu />
      </View>
    );
}