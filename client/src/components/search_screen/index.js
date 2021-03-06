import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
	getQuizzesBySearchInput,
	clearfilteredQuizzes,
} from '@redux/reducers/quizzes';

//==> Components
import QuizCards from '@components/utils/QuizCards';
import ScrollCategory from '@components/utils/ScrollCategory';
import NavBar from '@components/utils/NavBar';

//==> Styles
import styled, { ThemeProvider } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

//==> Assets
import strings from './strings';
import logo from '@assets/logo.png';

const SearchScreen = ({ navigation }) => {
	const { language, theme } = useSelector((state) => state.global);
	const { categories } = useSelector((state) => state.categories);
	const { filteredQuizzes } = useSelector((state) => state.quiz);
	const dispatch = useDispatch();
	const [searchInput, setSearchInput] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [submit, setSubmit] = useState(false);
	const s = strings[language];

	const filteredQuizzesWithCategoryFilter = useMemo(() => {
		return filteredQuizzes.filter(
			(quiz) => quiz.categoryId._id === categoryFilter,
		);
	}, [filteredQuizzes, categoryFilter]);

	const handleSelect = (categoryId) => {
		setCategoryFilter(categoryId);
	};

	const handleSearch = () => {
		setSubmit(true);
		if (searchInput.length < 2) return alert('Poco texto');
		dispatch(getQuizzesBySearchInput(searchInput));
	};
	categoryFilter ? filteredQuizzesWithCategoryFilter : filteredQuizzes;

	return (
		<ThemeProvider theme={theme}>
			<Screen contentContainerStyle={{ flexGrow: 1 }}>
				<NavBar
					string={s.nav}
					nav1={() => {
						navigation.goBack();
						dispatch(clearfilteredQuizzes());
					}}
					icon1='ios-arrow-back'
					icon2=''
				/>
				<InputContainer>
					<Title>{s.title}</Title>
					<IconImage
						name={'ios-search-outline'}
						size={28}
						color={'rgba(255,255,255,0.7)'}
						onPress={handleSearch}
					/>

					<InputLogin
						placeholder={s.ph1}
						placeholderTextColor={theme.text}
						underlineColorAndroid='transparent'
						onChangeText={(text) => {
							setSubmit(false);
							return setSearchInput(text);
						}}
						onSubmitEditing={handleSearch}
					/>
				</InputContainer>
				<View>
					<ScrollCategory
						categories={categories}
						handleSelect={handleSelect}
					/>
				</View>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					{!!filteredQuizzes.length ||
					!!filteredQuizzesWithCategoryFilter.length ? (
						<QuizCards
							quizzes={
								categoryFilter
									? filteredQuizzesWithCategoryFilter
									: filteredQuizzes
							}
						/>
					) : submit ? (
						<View
							style={{
								justifyContent: 'space-between',
								height: '100%',
							}}
						>
							<SearchMessage>{s.msg2}</SearchMessage>
							<Logo source={logo} />
						</View>
					) : (
						<View
							style={{
								justifyContent: 'space-between',
								height: '100%',
							}}
						>
							<SearchMessage>{s.msg1}</SearchMessage>
							<Logo source={logo} />
						</View>
					)}
				</ScrollView>
			</Screen>
		</ThemeProvider>
	);
};

const Screen = styled.ScrollView`
	flex: 1;
	background-color: ${(props) => props.theme.bg};
`;

const Title = styled.Text`
	width: 95%;
	align-self: center;
	color: ${(props) => props.theme.text};
	font-size: 28px;
	font-weight: bold;
	text-align: center;
`;
const InputContainer = styled.View`
	margin-top: 10px;
`;
const InputLogin = styled.TextInput`
	width: 95%;
	align-self: center;
	height: 45px;
	border-radius: 5px;
	border: 2px solid ${(props) => props.theme.primary};
	font-size: 16px;
	padding: 15px;
	background-color: ${(props) => props.theme.bg};
	color: ${(props) => props.theme.text};
	margin: 10px 0;
`;
const IconImage = styled(Icon)`
	color: ${(props) => props.theme.primary};
	position: absolute;
	top: 54px;
	right: 35px;
	z-index: 1;
`;

const SearchMessage = styled.Text`
	color: #999;
	font-size: 26px;
	text-align: center;
	margin: 20px auto;
	font-style: italic;
`;

const Logo = styled.Image`
	align-self: flex-start;
	width: 200px;
	height: 200px;
	opacity: 0.3;
`;

export default SearchScreen;
