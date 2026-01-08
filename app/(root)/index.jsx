import { SignedOut, useUser } from '@clerk/clerk-expo';
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useTransactions } from '../../hooks/useTransactions';
import { useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import { styles } from '../../assets/styles/home.style.js';
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import SignOutButton from '../../components/SignOutButton.jsx';
import { BalanceCard } from '../../components/BalanceCart.jsx';
import { TransactionItem } from '../../components/TransactionItem.jsx'
import NoTransactionsFound from '../../components/NoTransactionsFound.jsx';


export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id)

  const username =
    user?.emailAddresses[0]?.emailAddress.split("@")[0] || "";

  const displayName =
    username.length > 12 ? `${username.slice(0, 12)}...` : username;

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ])
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  if (isLoading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* Header  */}
        <View style={styles.header}>

          {/* Header LEft */}
          <View style={styles.headerLeft}>
            <Image source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode='contain' />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {displayName}
              </Text>
            </View>
          </View>

          {/* Header Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#fff"></Ionicons>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.transactionTitle}>Resent transaction</Text>
        </View>
      </View>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />)}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />


    </View>
  )
}
