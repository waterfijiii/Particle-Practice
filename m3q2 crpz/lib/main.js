import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let textMesh = new THREE.Mesh();
let stars, starGeo;

let scaleDelta = 0.005; // Adjust the scale change speed
let isScalingUp = true;

lighting();
text();
particles();

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function text() {
  const texture = new THREE.TextureLoader().load("../assets/textures/marble.jpg");

  const loader = new FontLoader();
  loader.load('../assets/fonts/Poppins_Regular.json', function (font) {
    const textGeometry = new TextGeometry('Jhelloh', {
      font: font,
      size: 3,
      height: 1,
    });
    textGeometry.center();
    const textMaterial = new THREE.MeshToonMaterial({ map: texture });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);
  });
  camera.position.z = 15;
  textMesh.position.z = -5;
}

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const vertices = starGeo.attributes.position.array;

  for (let i = 1; i < vertices.length; i += 3) {
    vertices[i] -= 0.2; // Adjust the value to control the stars' falling speed

    if (vertices[i] < -300) {
      vertices[i] = 300;
    }
  }

  starGeo.attributes.position.needsUpdate = true;
}

function changeColor() {
  let hex_var = '0x';
  const hexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * hexes.length);
    hex_var += hexes[index];
  }

  stars.material.color.setHex(hex_var);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  // Add a beating effect to the text geometry scale
  if (isScalingUp) {
    textMesh.scale.multiplyScalar(1 + scaleDelta);
  } else {
    textMesh.scale.multiplyScalar(1 - scaleDelta);
  }

  // Change direction when reaching a certain scale
  if (textMesh.scale.x > 1.1 || textMesh.scale.x < 0.9) {
    isScalingUp = !isScalingUp;
  }

  textMesh.rotation.x += 0.008;
  textMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();
setInterval(changeColor, 3000);
