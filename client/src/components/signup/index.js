import React, { useEffect, useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { REACT_APP_API } from '@root/env';
import styled, { ThemeProvider } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import backgroundImage from '@assets/img/backgroundImage.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setToken } from '@redux/reducers/user';
import axios from 'axios';
import strings from './strings';
import logo from '@assets/logo.png';

const { width: WIDTH } = Dimensions.get('window');

export default function SignUp({ navigation }) {
	const dispatch = useDispatch();
	const { language, theme } = useSelector((state) => state.global);
	const s = strings[language];

	const [hidePass, setHidePass] = useState(true);
	const [errortext, setErrortext] = useState('');

	const [user, setUser] = useState({
		email: '',
		firstName: '',
		password: '',
		lastName: '',
		countryCode: '',
	});

	const onPress = () => setHidePass((prevState) => !prevState);

	const handleLoginPress = () => {
		navigation.navigate('Login');
	};

	const handleInputChange = (inputName, inputValue) => {
		setUser((user) => ({
			...user,
			[inputName]: inputValue, // <-- Put square brackets
		}));
	};

	useEffect(() => {
		axios
			.get('https://ipapi.co/json/')
			.then((response) => {
				setUser((user) => ({
					...user,
					countryCode: response.data.country_code,
				}));
			})
			.catch(() => {
				setUser((user) => ({
					...user,
					countryCode: 'AR',
				}));
			});
	}, []);

	const handleSubmitPress = () => {
		const emailRegex = /\S+@\S+/;
		if (user.email && !emailRegex.test(user.email)) {
			setErrortext('Ingrese un Email válido');
			return;
		}
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
		if (user.password && !passwordRegex.test(user.password)) {
			setErrortext('Caracteres inválidos en contraseña');
			return;
		}
		if (!user.email) {
			setErrortext('El campo Contraseña es requerido');
			return;
		}
		if (!user.password) {
			setErrortext('El campo Contraseña es requerido');
			return;
		}
		if (!user.firstName) {
			setErrortext('El campo Nombre es requerido');
			return;
		}
		if (!user.lastName) {
			setErrortext('El campo Apellido es requerido');
			return;
		} else {
			axios.post(`${REACT_APP_API}/auth/register`, user).then((token) => {
				axios
					.get(`${REACT_APP_API}/auth/me`, {
						headers: {
							Authorization: `Bearer ${token.data}`,
						},
					})
					.then((user) => {
						dispatch(getUser(user.data));
						dispatch(setToken(token.data));
						navigation.navigate('Home');
					});
			});
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container source={backgroundImage}>
				<LogoView>
					<Logo source={logo} />
					<LogoText>QuizMeApp</LogoText>
				</LogoView>
				<InputContainer>
					<IconImage
						name={'ios-person-outline'}
						size={28}
						color={'rgba(255,255,255,0.7)'}
					/>
					<InputSignUp
						width={WIDTH}
						placeholder={s.name}
						value={user.firstName}
						onChangeText={(value) =>
							handleInputChange('firstName', value)
						}
						placeholderTextColor={'rgba(255,255,255,0.7)'}
						underlineColorAndroid='transparent'
					/>
				</InputContainer>
				<InputContainer>
					<IconImage
						name={'ios-person-outline'}
						size={28}
						color={'rgba(255,255,255,0.7)'}
					/>
					<InputSignUp
						width={WIDTH}
						placeholder={s.lastName}
						value={user.lastName}
						onChangeText={(value) =>
							handleInputChange('lastName', value)
						}
						placeholderTextColor={'rgba(255,255,255,0.7)'}
						underlineColorAndroid='transparent'
					/>
				</InputContainer>
				<InputContainer>
					<IconImage
						name={'mail-open-outline'}
						size={28}
						color={'rgba(255,255,255,0.7)'}
					/>
					<InputSignUp
						width={WIDTH}
						placeholder={s.email}
						value={user.email}
						onChangeText={(value) =>
							handleInputChange('email', value)
						}
						placeholderTextColor={'rgba(255,255,255,0.7)'}
						underlineColorAndroid='transparent'
					/>
				</InputContainer>
				<InputContainer>
					<IconImage
						name={'ios-lock-closed-outline'}
						size={28}
						color={'rgba(255,255,255,0.7)'}
					/>
					<InputSignUp
						width={WIDTH}
						placeholder={s.pass}
						value={user.password}
						onChangeText={(value) =>
							handleInputChange('password', value)
						}
						secureTextEntry={hidePass}
						placeholderTextColor={'rgba(255,255,255,0.7)'}
						underlineColorAndroid='transparent'
					/>
					<Button onPress={onPress}>
						<Icon
							name={'ios-eye-outline'}
							size={26}
							color={'rgba(255,255,255,0.7)'}
						/>
					</Button>
				</InputContainer>

				<TextView>
					<Text>
						<Text
							style={{ fontWeight: '500', color: 'blue' }}
							onPress={handleLoginPress}
						>
							{errortext}
						</Text>
					</Text>
				</TextView>

				<ButtonSignUp width={WIDTH} onPress={handleSubmitPress}>
					<Description>{s.signup}</Description>
				</ButtonSignUp>
				<TextView>
					<Text style={{ color: theme.text }}>
						{s.acc}
						<Text
							style={{ fontWeight: '500', color: theme.primary }}
							onPress={handleLoginPress}
						>
							{' '}
							{s.login}
						</Text>
					</Text>
				</TextView>
			</Container>
		</ThemeProvider>
	);
}

const Container = styled.View`
	background-color: ${(props) => props.theme.bg};
	flex: 1;
	justify-content: center;
	align-items: center;
	width: null;
	height: null;
`;
const LogoView = styled.View`
	align-items: center;
	margin-bottom: 40px;
`;
const Logo = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 100px;
`;
const LogoText = styled.Text`
	color: ${(props) => props.theme.primary};
	font-size: 30px;
	font-weight: 500;
	margin-top: 10px;
	opacity: 0.5;
`;
const InputContainer = styled.View`
	margin-top: 10px;
`;
const InputSignUp = styled.TextInput`
	width: ${(props) => props.width - 55}px;
	height: 45px;
	font-size: 16px;
	padding-left: 45px;
	background-color: rgba(0, 0, 0, 0.35);
	color: rgba(255, 255, 255, 0.7);
	margin: 0 25px;
`;
const IconImage = styled(Icon)`
	position: absolute;
	top: 8px;
	left: 38px;
	z-index: 1;
`;
const Button = styled.TouchableOpacity`
	position: absolute;
	top: 8px;
	right: 38px;
`;
const ButtonSignUp = styled.TouchableOpacity`
	width: ${(props) => props.width - 55}px;
	border-radius: 5px;
	height: 45px;
	background-color: ${(props) => props.theme.primary};
	justify-content: center;
	padding: 16px 70px;
`;
const Description = styled.Text`
	color: rgba(255, 255, 255, 0.7);
	font-size: 16px;
	text-align: center;
`;
const TextView = styled.View`
	align-items: center;
	margin-top: 20px;
`;
