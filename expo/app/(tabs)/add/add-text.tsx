import { fetch } from "expo/fetch";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import supabase from "@/utils/supabase";

import { IngredientSearch } from "../../../types";
import Input from "../../components/Input";

export default function AddText() {
  const router = useRouter();
  const abort = useRef<AbortController | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [search, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientSearch[]>([]);

  const handleInput = (text: string) => {
    setSearchText(text);

    // Clear previous timeout
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Set new timeout
    timeout.current = setTimeout(() => {
      handleSearch(text);
    }, 500);
  };

  const handleSelect = (ingredient: IngredientSearch) => {
    router.push({
      pathname: "/add/add-preview-barcode",
      params: { barcode: ingredient.openfood_id },
    });
  };

  const handleSearch = (search: string) => {
    if (search.length < 2) {
      return;
    }

    setLoading(true);

    const fetchIngredients = async () => {
      if (abort.current) {
        abort.current.abort();
      }

      abort.current = new AbortController();

      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;

      const body = JSON.stringify({ query: search, lang: "nl" });
      const signal = abort.current.signal;
      const method = "POST";
      const headers = {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`https://swiftbite.app/api/ai/search`, {
        body,
        signal,
        method,
        headers,
      });

      if (!response.ok) {
        const body = await response.json();
        const error = body.error;

        Alert.alert("Error", error);
      }

      if (!response.body) {
        return;
      }

      const decoder = new TextDecoder();
      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setLoading(false);

          break;
        }

        const decoded = decoder.decode(value);
        const parsed = JSON.parse(decoded);

        if (parsed.length > 0) {
          setIngredients(parsed);
          setLoading(false);
        }
      }
    };

    fetchIngredients();
  };

  const renderIngredientItem = ({ item }: { item: IngredientSearch }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemBrand}>{item.brand}</Text>
          <Text>{item.quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <Input
          type="default"
          value={search}
          placeholder="Search for food..."
          onChange={handleInput}
        />
      </View>

      {search.length < 2 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Type at least 2 characters to search
          </Text>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#405cf5" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : ingredients && ingredients.length > 0 ? (
        <FlatList
          data={ingredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item.openfood_id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
