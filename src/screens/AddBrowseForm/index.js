import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import { Add, ArrowLeft, AddSquare } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const AddBrowseForm = () => {
  const handleImagePick = async () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setImage(image.path);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    let filename = image.substring(image.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    const reference = storage().ref(`browseimages/${filename}`);

    setLoading(true);
    try {
      await reference.putFile(image);
      const url = await reference.getDownloadURL();
      await firestore().collection('browse').add({
        image: url,
        name: blogData.title,
        category: blogData.category,
        description: blogData.content,
        createdBy: "Admin",
      });
      setLoading(false);
      console.log('Browse added!');
      navigation.navigate('Browse');
    } catch (error) {
      console.log(error);
    }
  };
  const dataCategory = [
    { id: 1, name: "Lukisan" },
    { id: 2, name: "Patung" },
    { id: 3, name: "Tarian" },
  ];
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: {},
    totalLikes: 0,
    totalComments: 0,
  });
  const handleChange = (key, value) => {
    setBlogData({
      ...blogData,
      [key]: value,
    });
  };
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={'black'} variant="Linear" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Postingan Baru</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        <Text style={{ color: 'black' }}>Judul</Text>
        <View style={textInput.border}>
          <TextInput
            placeholder="Masukkan Judul Postingan Anda"
            value={blogData.title}
            onChangeText={(text) => handleChange("title", text)}
            placeholderTextColor={'rgba(128, 128, 128, 0.6)'}
            multiline
            style={textInput.title}
          />
        </View>
        <Text style={{ color: 'black' }}>Deskripsi</Text>
        <View style={[textInput.border, { minHeight: 250 }]}>
          <TextInput
            placeholder="Masukkan Deskripsi Postingan Anda"
            value={blogData.content}
            onChangeText={(text) => handleChange("content", text)}
            placeholderTextColor={'rgba(128, 128, 128, 0.6)'}
            multiline
            style={textInput.content}
          />
        </View>
        <Text style={{ color: 'black' }}>Kategori</Text>
        <View style={[textInput.border]}>
          <View style={category.container}>
            {dataCategory.map((item, index) => {
              const bgColor =
                item.id === blogData.category.id
                  ? '#FFC600'
                  : '#FFE58C';
              const color =
                item.id === blogData.category.id
                  ? 'black'
                  : 'black';
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    handleChange("category", { id: item.id, name: item.name })
                  }
                  style={[category.item, { backgroundColor: bgColor }]}
                >
                  <Text style={[category.name, { color: color }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Text style={{ color: 'black' }}>Foto</Text>
        {image ? (
          <View style={{ position: 'relative' }}>
            <Image
              style={{ width: '100%', height: 200, borderRadius: 5 }}
              source={{
                uri: image,
              }}
              resizeMode={'cover'}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: '#FFC600',
                borderRadius: 25,
              }}
              onPress={() => setImage(null)}>
              <Add
                size={20}
                variant="Linear"
                color={'white'}
                style={{ transform: [{ rotate: '45deg' }] }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleImagePick}>
            <View
              style={[
                textInput.border,
                {
                  gap: 10,
                  paddingVertical: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <AddSquare color={'rgba(128, 128, 128, 0.6)'} variant="Linear" size={42} />
              <Text
                style={{
                  fontSize: 12,
                  color: 'rgba(128, 128, 128, 0.6)',
                }}>
                Upload Foto
              </Text>
            </View>
          </TouchableOpacity>
        )}

      </ScrollView>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (<TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonLabel}>Upload</Text>
      </TouchableOpacity>)}
    </View>
  );
};

export default AddBrowseForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    marginHorizontal: 24,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFC600',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 14,
    color: 'black',
  },
});
const textInput = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: 'rgba(128, 128, 128, 0.4)',
  },
  title: {
    fontSize: 14,
    color: 'black',
    padding: 0,
  },
  content: {
    fontSize: 14,
    color: 'black',
    padding: 0,
  },
});
const category = StyleSheet.create({
  title: {
    fontSize: 12,
    color: 'rgba(128, 128, 128, 0.6)',
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
  },
  name: {
    fontSize: 12,
  },
});