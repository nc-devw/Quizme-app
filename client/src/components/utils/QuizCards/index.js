import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import strings from '@components/home_screen/strings';
import { Text, Share, Platform, Vibration } from 'react-native';
import socialStrings from '@components/quiz_index/strings';

const QuizCards = ({ quizzes, completedQuiz }) => {
	const navigation = useNavigation();
	const { theme, language } = useSelector((state) => state.global);
	const s = strings[language];
	const likes = useSelector((state) => state.user.likedQuiz);

	const checkLike = (quizId) => {
		return likes.some((like) => like === quizId);
	};

	const shareSocialMedia = async () => {
		try {
			await Share.share({
				title: socialStrings[language].title,
				message: `${
					socialStrings[language].message
				}${'\n'}https://tenor.com/view/children-pupil-hard-party-drugs-gif-3956833`,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<QuizCardsContainer>
			{quizzes &&
				!!quizzes.length &&
				quizzes.map((quiz) => (
					<QuizCard
						onLongPress={shareSocialMedia}
						key={quiz._id}
						onPress={() => {
							if (Platform.OS === 'android') {
								Vibration.vibrate(100);
							}

							navigation.navigate('QuizIndex', {
								quiz,
							});
						}}
					>
						<QuizImg
							source={{
								uri: quiz.image,
							}}
						/>
						<QuizInfo>
							<QuizTitle>{quiz.title}</QuizTitle>
							<StyledText>{quiz.description}</StyledText>
							<StyledText>
								<Icon
									name={
										checkLike(quiz._id)
											? 'ios-heart-sharp'
											: 'ios-heart-outline'
									}
									size={15}
									style={{ color: theme.primary }}
								/>
								{quiz.likes}
							</StyledText>
						</QuizInfo>
						{completedQuiz &&
							completedQuiz.some((e) => e._id === quiz._id) && (
								<QuizCheck>
									<Text style={{ color: theme.primary }}>
										{s.completed}
									</Text>
									<Icon
										name='checkmark-circle-outline'
										size={20}
										style={{ color: theme.primary }}
									/>
								</QuizCheck>
							)}
					</QuizCard>
				))}
		</QuizCardsContainer>
	);
};

const StyledText = styled.Text`
	color: ${(props) => props.theme.text};
`;

const QuizCardsContainer = styled.View`
	width: 95%;
	align-self: center;
`;
const QuizCard = styled.TouchableOpacity`
	width: 100%;
	height: 120px;
	border-bottom-width: 1px;
	border-bottom-color: #ccc;
	align-items: center;
	flex-direction: row;
	padding: 15px 10px 10px 10px;
`;

const QuizImg = styled.Image`
	z-index: 3;
	height: 80px;
	width: 80px;
	border-radius: 10px;
`;

const QuizInfo = styled.View`
	height: 100%;
	width: 85%;
	padding: 0 15px;
	justify-content: space-around;
`;

const QuizTitle = styled.Text`
	font-size: 18px;
	font-weight: bold;
	color: ${(props) => props.theme.text};
	margin-top: 3px;
`;

const QuizCheck = styled.View`
	position: absolute;
	top: 5px;
	right: 5px;
	flex-direction: row-reverse;
	align-items: center;
`;

export default QuizCards;
