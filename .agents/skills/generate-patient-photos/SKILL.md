---
name: generate-patient-photos
description: Генерация фотореалистичных ИИ-аватаров «пациентов» для сайта УринаТех (public/avatars, отзывы TestimonialsStore). Использовать, когда нужно создать новые портреты персонажей или заменить SVG-заглушки на фото. Покрывает генерацию локально (SD1.5 на CPU) и через сервисы (HF Spaces FLUX, платные API), ловушки окружения и интеграцию в проект.
---

# Генерация фото «пациентов» для УринаТех

Сайт — сатира на псевдомедицину. Аватары пациентов — фотореалистичные портреты
НЕСУЩЕСТВУЮЩИХ людей. Никогда не использовать фото реальных людей.

## Целевой формат

- Размер файла: 256×256 JPEG (quality ~85–88) или WebP, ≈10–18 КБ.
- Кадр: «фото на документы» — лицо анфас, по центру, плечи, нейтральный фон.
- Промпт-шаблон:
  `realistic ID photo of <описание персонажа>, plain neutral light background, head and shoulders, centered, photorealistic, sharp focus`
- Негативный промпт: `(worst quality, low quality:1.4), watermark, text, logo, signature, deformed, disfigured, extra fingers, bad hands, cartoon, painting, 3d render`
- В карточках применяется CSS `filter: sepia(0.25)` — цветовые различия генераторов сглаживаются.
- Имена файлов: слаг персонажа (`kuzmich.jpg`), кладутся в `public/avatars/`.

## Интеграция в проект

1. Файл → `public/avatars/<slug>.jpg`.
2. В `src/stores/TestimonialsStore.ts` у персонажа задать `avatar: "<slug>.jpg"`
   (SVG-заглушки — `"<slug>.svg"`, генератор: `tools/gen_placeholders.py`).
3. `src/components/Testimonials.tsx` рендерит `<img src={BASE_URL + "avatars/" + avatar}>` —
   путь уже учитывает GitHub Pages base (`/mu-hospital/`).
4. Прод-проверка после деплоя: `curl -I https://enikey87.github.io/mu-hospital/avatars/<slug>.jpg`.

## Вариант A: Hugging Face Spaces, FLUX.1-schnell (лучшее качество, бесплатно)

Через gradio-клиент к официальному спейсу `black-forest-labs/FLUX.1-schnell`.
4 шага, секунды на мощном GPU спейса, без водяных знаков.

Ограничения: анонимная ZeroGPU-квота ≈ пара картинок в день; с бесплатным
HF-токеном квота больше. Токен: https://huggingface.co/settings/tokens,
передавать в `Client(..., token=...)` или env `HF_TOKEN`.

```bash
python3.10 -m venv /tmp/avgen && /tmp/avgen/bin/pip install gradio_client
```

```python
from gradio_client import Client

client = Client("black-forest-labs/FLUX.1-schnell")  # , token="hf_..." при наличии
result = client.predict(
    prompt="realistic ID photo of ..., photorealistic",
    seed=1234, randomize_seed=False,
    width=256, height=256, num_inference_steps=4,
    api_name="/infer",
)
# result — путь к скачанному файлу (WebP); скопировать в public/avatars/
```

## Вариант B: локально, SD 1.5 на CPU (без квот и ключей)

Машина проекта: Intel i9 / 32 ГБ / macOS x86_64 — потянет только SD1.5
(~2–3 мин на портрет 512px). SDXL/FLUX локально — нет.

Ловушки окружения (проверено на этом маке):
- Системный `python3` — 3.14, под него НЕТ torch. Использовать `/usr/local/bin/python3.10`.
- Под x86 macOS последний torch — **2.2.2**; свежие diffusers требуют torch≥2.6 → пинить.
- Свежий huggingface_hub удалил `cached_download`, нужный diffusers 0.27 → пинить.
- numpy 2.x ломает torch 2.2 → `numpy==1.26.4`.
- Файнтюн Realistic Vision V5.1 падает с ошибкой шедулера `deis` на diffusers 0.27
  → передавать `scheduler` явно из базового SD1.5 (см. скрипт) или использовать базу.

```bash
/usr/local/bin/python3.10 -m venv /tmp/avgen310
/tmp/avgen310/bin/pip install torch "diffusers==0.27.2" "transformers==4.41.2" \
  "huggingface_hub==0.23.2" "numpy==1.26.4" safetensors pillow
```

```python
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler

sched = DPMSolverMultistepScheduler.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5", subfolder="scheduler")
pipe = StableDiffusionPipeline.from_pretrained(
    "stable-diffusion-v1-5/stable-diffusion-v1-5",  # или SG161222/Realistic_Vision_V5.1_noVAE + scheduler=sched
    scheduler=sched, torch_dtype=torch.float32)
pipe.to("cpu")

img = pipe(prompt, negative_prompt=NEG, num_inference_steps=25,
           guidance_scale=6.0, width=512, height=512,
           generator=torch.Generator("cpu").manual_seed(seed)).images[0]
img.resize((256, 256)).save("public/avatars/<slug>.jpg", quality=88)
```

## Вариант C: платные/ключевые API (когда нужна чистая лицензия или объём)

- **Generated Photos** (generated.photos) — специализация на лицах, API,
  фильтры возраст/этнос/эмоция, явная коммерческая лицензия (~$199/год).
- **Универсальные генералки по API-ключу**: Together AI, Replicate (FLUX),
  Google (Imagen/Gemini), OpenAI (GPT Image) — у всех бесплатный стартовый
  кредит по регистрации карты; качество FLUX-класса.

## Что НЕ использовать (проверено, не работает)

- **Pollinations.ai** — бесплатно и без ключа, но бесплатный tier ставит
  водяной знак «pollinations.ai» на все модели; `nologo=true` не помогает.
- **AI Horde (stablehorde/aihorde)** — анонимные запросы получают 403.
- Кропать вотермарки с бесплатных сервисов — нельзя: это обход условий.

## Критерии готовности

- [ ] Файл 256×256, ≤ 20 КБ, без водяных знаков и текста.
- [ ] Лицо анфас, по центру, без мутированных рук/глаз.
- [ ] `avatar` в TestimonialsStore указан, на проде файл отдаёт 200.
- [ ] Дисклеймер «внешний вид восстановлен нейросетью…» присутствует в секции отзывов.
