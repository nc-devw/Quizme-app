import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeProvider } from 'styled-components/native';

export default function LikeButton({ handleOnFavorite, isLiked }) {
	const [isLikedLocal, setIsLikedLocal] = useState(isLiked);
	const { theme } = useSelector((state) => state.global);
	return (
		<ThemeProvider theme={theme}>
			<TouchableOpacity
				style={{ marginRight: 20 }}
				onPress={() => {
					handleOnFavorite(!isLikedLocal);
					setIsLikedLocal((prevState) => !prevState);
				}}
			>
				<Icon
					name={
						isLikedLocal ? 'heart-circle' : 'heart-circle-outline'
					}
					size={50}
					color={theme.primary}
				/>
			</TouchableOpacity>
		</ThemeProvider>
	);
}
