
// Создаём сцену
const scene = new THREE.Scene();

// Создаём рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Загружаем модель GLTF
const loader = new THREE.GLTFLoader();
loader.load(
  'models\scene.gltf', // Путь к вашей модели
  (gltf) => {
    const model = gltf.scene;

    // Добавляем модель на сцену
    scene.add(model);

    // Если в модели есть камера, используем её
    if (gltf.cameras && gltf.cameras.length > 0) {
      const camera = gltf.cameras[0];
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    } else {
      // Если камеры нет, создаём свою
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1, 5); // Настройте позицию камеры под вашу модель
      scene.add(camera);
    }

    // Центрирование модели
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    // Масштабирование модели (если необходимо)
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim; // Масштабируем модель до размера ~1
    model.scale.set(scale, scale, scale);

    // Анимация
    function animate() {
      requestAnimationFrame(animate);

      // Вращение модели (опционально)
      model.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,
  (error) => {
    console.error('Ошибка загрузки модели:', error);
  }
);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  if (scene.children.length > 0) {
    const camera = scene.children.find((child) => child.isCamera);
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
});