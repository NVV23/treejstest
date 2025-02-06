// Импортируем Three.js и GLTFLoader
import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js';

// Создаём сцену
const scene = new THREE.Scene();

// Создаём камеру
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

// Создаём рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Добавляем освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

// Загружаем модель GLTF
const loader = new GLTFLoader();
loader.load(
  'models/scene.gltf', // Путь к вашей модели
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Центрирование модели
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    // Масштабирование модели
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim;
    model.scale.set(scale, scale, scale);
  },
  undefined,
  (error) => {
    console.error('Ошибка загрузки модели:', error);
  }
);

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Вращение модели (опционально)
  if (scene.children.length > 0) {
    scene.children[0].rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});