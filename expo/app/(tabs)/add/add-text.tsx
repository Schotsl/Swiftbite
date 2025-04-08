import { useIsFocused } from "@react-navigation/native";
import { fetch } from "expo/fetch";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

import Input from "@/components/Input";
import { ProductSearch } from "@/types";
import supabase from "@/utils/supabase";

export default function AddText() {
  const abort = useRef<AbortController | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const focus = useIsFocused();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductSearch[]>([]);

  const handleInput = (text: string) => {
    setQuery(text);

    // Clear previous timeout
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Set new timeout
    timeout.current = setTimeout(() => handleSearch(text), 500);
  };

  const handleSelect = (product: ProductSearch) => {
    router.replace({
      pathname: "/add/add-preview-barcode",
      params: {
        title: product.title,
        brand: product.brand,
        quantity: product.quantity,
      },
    });
  };

  const handleSearch = (search: string) => {
    if (search.length < 2) {
      return;
    }

    setLoading(true);

    const fetchProducts = async () => {
      if (abort.current) {
        abort.current.abort();
      }

      abort.current = new AbortController();

      const session = await supabase.auth.getSession();
      const bearer = session?.data.session?.access_token;

      const signal = abort.current.signal;
      const headers = {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/search?query=${search}&lang=nl`,
        {
          signal,
          headers,
        }
      );

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
          setProducts(parsed);
          setLoading(false);
        }
      }
    };

    fetchProducts();
  };

  // Reset the page's state when is the screen is unfocused
  useEffect(() => {
    if (focus) {
      return;
    }

    setQuery("");
    setLoading(false);
    setProducts([]);
  }, [focus]);

  const renderProductItem = ({ item }: { item: ProductSearch }) => (
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
          name="query"
          type="default"
          value={query}
          placeholder="Search for food..."
          onChange={handleInput}
        />
      </View>

      {query.length < 2 ? (
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
      ) : products && products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
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
