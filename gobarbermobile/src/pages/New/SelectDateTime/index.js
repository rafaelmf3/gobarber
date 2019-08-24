import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Background from '~/components/Background';
import DateInput from '~/components/DateInput'
import api from '~/services/api';

import { Container, HourList, Hour, Title } from './styles';

export default function SelectDateTime({ navigation }) {
  const [date, newDate] = useState(new Date());
  const [hours, setHours] = useState([])

  const provider = navigation.getParam('provider');

  useEffect(() => {
    async function loadAvilable() {
      const response = await api.get(`providers/${provider.id}/available`, {
        params: {
          date: date.getTime(),
        },
      });

      setHours(response.data);
    }

    loadAvilable();
  }, [date, provider.id]);

  function handleSelectHour(time) {
    navigation.navigate('Confirm', {
      provider,
      time,
    })
  }

  return (
    <Background>
      <Container>
        <DateInput date={date} onChange={setDate}/>

        <HourList
          data={hours}
          keyExtractor={item => item.time}
          renderItem={({item}) => (
            <Hour
              onPress={() => handleSelectHour(item.value)}
              enabled={item.available}
            >
              <Title>{item.time}</Title>
            </Hour>
          )}
        />
      </Container>
    </Background>
  );
}

SelectDateTime.navigationOptions = ({ navigation }) => ({
  title: 'Selecione o horário',
  headerLeft: () => (
    <TouchableOpacity onPress={() => { navigation.goBack();
      }}
    >
      <MaterialIcons name="chevron-left" size={20} color="#fff"  />
    </TouchableOpacity>
  )
});
