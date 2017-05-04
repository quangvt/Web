import Expo, { createTHREEViewClass } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const THREE = require('three');
const THREEView = createTHREEViewClass(THREE);

class App extends React.Component {
    componentDidMount() {
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
	this.camera.position.z = 5;
	
	this.geometry = new THREE.BoxGeometry(1, 1, 1);
	this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	this.cube = new THREE.Mesh(this.geometry, this.material);
	this.scene.add(this.cube);
    }

    tick = (dt) => {
	this.cube.rotation.x += dt * dt;
	this.cube.rotation.y += dt * dt;
    }
    render() {
	return (
	     
	      <THREEView
	  style = {{ flex: 1}}
	  scene = {this.scene}
	  camera = {this.camera}
	  tick = {this.tick}
	      />
	     
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Expo.registerRootComponent(App);
