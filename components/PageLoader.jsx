import { View, ActivityIndicator } from "react-native";
import { styles } from '../../mobile/assets/styles/auth.styles.js'
import { COLORS } from '../../mobile/constants/colors.js'

const PageLoader = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
};

export default PageLoader;
