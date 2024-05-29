import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TerminosYCondiciones = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>TERMINOS Y CONDICIONES</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="user" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Bienvenido/a a nuestros servicios. Por favor, lee atentamente los siguientes términos y condiciones antes de utilizar nuestros productos o servicios.
          </Text>
          <Text style={styles.termsTitle}>1. Aceptación de los Términos:</Text>
          <Text style={styles.termsText}>
            Al acceder o utilizar nuestros servicios, acepta cumplir estos términos y condiciones. Si no estás de acuerdo con alguno de los términos, por favor, no utilices nuestros servicios.
          </Text>
          <Text style={styles.termsTitle}>2. Uso de los Servicios:</Text>
          <Text style={styles.termsText}>
            Nuestros servicios están destinados para uso personal y no comercial. No debes utilizar nuestros servicios de manera indebida o para fines ilegales.
          </Text>
          <Text style={styles.termsTitle}>3. Propiedad Intelectual:</Text>
          <Text style={styles.termsText}>
            Todos los derechos de propiedad intelectual de nuestros servicios son propiedad de nuestra empresa. No tienes derecho a utilizar nuestras marcas, logos, o contenido sin autorización previa por escrito.
          </Text>
          <Text style={styles.termsTitle}>4. Privacidad:</Text>
          <Text style={styles.termsText}>
            Respetamos tu privacidad. Para obtener más información sobre cómo recopilamos, utilizamos y protegemos tus datos personales, consulta nuestra política de privacidad.
          </Text>
          <Text style={styles.termsTitle}>5. Limitación de Responsabilidad:</Text>
          <Text style={styles.termsText}>
            No nos ....
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="comments" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="book" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 10,
  },
  profileButton: {
    padding: 10,
  },
  scrollContainer: {
    padding: 16,
  },
  termsContainer: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    borderRadius: 10,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  termsText: {
    fontSize: 14,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  footerButton: {
    padding: 10,
  },
});

export default TerminosYCondiciones;
