from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[User] = None

class PDFContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    url: str
    module_id: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Module(BaseModel):
    id: str
    number: int
    title: str
    description: str
    icon: str
    color: str
    image: Optional[str] = None
    pdfs: List[PDFContent] = []

class News(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    image: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Meal(BaseModel):
    name: str
    description: str
    calories: int
    time: str

class DayPlan(BaseModel):
    day: int
    cafe_da_manha: Meal
    almoco: Meal
    sobremesa: Meal
    lanche: Meal
    janta: Meal
    total_calories: int

class PDFCreate(BaseModel):
    name: str
    url: str
    module_id: str

class NewsCreate(BaseModel):
    title: str
    content: str
    image: Optional[str] = None

DEFAULT_PASSWORD = "receitas321"

MODULES = [
    {"id": "module_1", "number": 1, "title": "365 Receitas com Ovo", "description": "O guia completo de 365 receitas saudáveis com ovo.", "icon": "egg", "color": "#FF6B35", "image": "https://customer-assets.emergentagent.com/job_8428dfd2-2530-48ad-8f9b-4f75403d5948/artifacts/xa7pdmdj_%2B365%20receitas%20ovo.png"},
    {"id": "module_2", "number": 2, "title": "Air Fryer e Praticidade", "description": "150 Receitas de Air Fryer + 10 Tortilhas Saudáveis.", "icon": "fast-food", "color": "#00C896", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/67thsiqu_CAPA%20150%20RECEITA%20AIR%20FRYER.png"},
    {"id": "module_3", "number": 3, "title": "Confeitaria, Doces e Bolos", "description": "Curso completo de Bolos Caseiros + 100 Receitas de Bolo no Palito.", "icon": "cafe", "color": "#E91E63", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/co120gqi_BOLOS%20E%20DOCES.png"},
    {"id": "module_4", "number": 4, "title": "Sobremesas Geladas e Verão", "description": "Geladinhos Gourmet, Sorvetes e Doces Fit e Low Carb.", "icon": "ice-cream", "color": "#2196F3", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/cjglo1o8_Sobremesas%20geladas.png"},
    {"id": "module_5", "number": 5, "title": "Padaria Saudável e Pães", "description": "115+ Receitas de Pães Zero Glúten + Videoaulas 2026.", "icon": "nutrition", "color": "#795548", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/h0vbazr6_padaria%20e%20paes%20zero%20glut%C3%A9n.png"},
    {"id": "module_6", "number": 6, "title": "Academia e Whey Protein", "description": "200 Receitas com Whey + 35 Receitas de Pré e Pós Treino.", "icon": "fitness", "color": "#9C27B0", "image": "https://customer-assets.emergentagent.com/job_8428dfd2-2530-48ad-8f9b-4f75403d5948/artifacts/rhu50cg4_200%20receitas%20com%20whey%20protein.png"},
    {"id": "module_7", "number": 7, "title": "Diabéticos (Controle Total)", "description": "450 Receitas para Diabéticos + Chás Aliados.", "icon": "heart", "color": "#F44336", "image": "https://customer-assets.emergentagent.com/job_8428dfd2-2530-48ad-8f9b-4f75403d5948/artifacts/3t61yten_450%20receitas%20para%20diabeticos.png"},
    {"id": "module_8", "number": 8, "title": "Lancheira Saudável (Kids)", "description": "Cardápios, Bebidas e Receitas para Alérgicos.", "icon": "school", "color": "#FFC107", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/0nuhkrn5_lancheira%20kids.png"},
    {"id": "module_9", "number": 9, "title": "Emagrecimento e Intestino", "description": "Sucos Detox, Protocolo Truque do Limão e Mounjaro de Pobre.", "icon": "leaf", "color": "#4CAF50", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/ji0k22jq_sucos%20e%20chas%20detox.png"},
    {"id": "module_10", "number": 10, "title": "Refeições, Sopas e Substituições", "description": "Receitas de Sopas + Guia de Substituição de Ingredientes.", "icon": "restaurant", "color": "#FF9800", "image": "https://customer-assets.emergentagent.com/job_receitas-saudaveis-7/artifacts/jlskl04z_SOPAS%20E%20CREMES.png"}
]

INITIAL_PDFS = [
    {"name": "365 Receitas com Ovo", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/mmsltykt_365%20receitas%20com%20OVO.pdf", "module_id": "module_1"},
    {"name": "200 Receitas Com Whey Protein", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/uq78de4c_200-Receitas-Com-Whey-Protein.pdf", "module_id": "module_6"},
    {"name": "5 Sobremesas Proteicas Internacionais", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/76h7hl7d_5-SOBREMESAS-PROTEICAS-INTERNACIONAISpdf.pdf", "module_id": "module_6"},
    {"name": "30 Receitas Saudáveis para Air Fryer", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/s8hv7xhz_30-RECEITAS-SAUDAVEIS-PARA-AIR-FRYERpdf.pdf", "module_id": "module_2"},
    {"name": "35 Receitas de Doces Fit para Crianças e Família", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/zwif7qkn_35-RECEITAS-DE-DOCES-FIT-PARA-CRIANCAS-E-FAMILIApdf.pdf", "module_id": "module_8"},
    {"name": "Receitas para Crianças +1 Ano", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/0kj07gml_RECEITAS--PARA--CRIAN%C3%87A--%2B1--ANOS--%281%29%20%281%29.pdf", "module_id": "module_8"},
    {"name": "60 Receitas de Trufas Lucrativas", "url": "https://customer-assets.emergentagent.com/job_receitas-365-luxo/artifacts/egych6f7_60%20RECEITAS%20DE%20TRUFAS%20LUCRATIVAS.pdf", "module_id": "module_3"},
]

MEAL_PLAN = [
    {"day": 1, "cafe_da_manha": {"name": "Omelete de Espinafre", "description": "2 ovos, espinafre, tomate cereja e queijo cottage", "calories": 280, "time": "07:00"}, "almoco": {"name": "Frango Grelhado com Batata Doce", "description": "150g peito de frango, 100g batata doce, salada verde", "calories": 420, "time": "12:00"}, "sobremesa": {"name": "Mousse de Maracujá Fit", "description": "Iogurte natural, maracujá e adoçante", "calories": 120, "time": "13:00"}, "lanche": {"name": "Mix de Castanhas", "description": "30g de castanhas variadas com 1 fruta", "calories": 180, "time": "16:00"}, "janta": {"name": "Sopa de Legumes", "description": "Abobrinha, cenoura, chuchu e frango desfiado", "calories": 250, "time": "19:00"}, "total_calories": 1250},
    {"day": 2, "cafe_da_manha": {"name": "Tapioca com Ovo", "description": "Tapioca recheada com ovo mexido e tomate", "calories": 300, "time": "07:00"}, "almoco": {"name": "Peixe Assado com Arroz Integral", "description": "150g tilápia, arroz integral, brócolis", "calories": 380, "time": "12:00"}, "sobremesa": {"name": "Gelatina Diet com Frutas", "description": "Gelatina sem açúcar com morango", "calories": 60, "time": "13:00"}, "lanche": {"name": "Banana com Canela", "description": "1 banana amassada com canela e aveia", "calories": 160, "time": "16:00"}, "janta": {"name": "Salada Caesar Light", "description": "Alface, frango desfiado, croutons integrais", "calories": 300, "time": "19:00"}, "total_calories": 1200},
    {"day": 3, "cafe_da_manha": {"name": "Smoothie Verde", "description": "Espinafre, banana, leite desnatado e chia", "calories": 250, "time": "07:00"}, "almoco": {"name": "Carne Moída com Purê de Abóbora", "description": "120g carne moída magra, purê de abóbora", "calories": 400, "time": "12:00"}, "sobremesa": {"name": "Açaí Fit", "description": "100g açaí sem xarope com granola light", "calories": 150, "time": "13:00"}, "lanche": {"name": "Iogurte Natural com Mel", "description": "200ml iogurte natural com 1 colher de mel", "calories": 140, "time": "16:00"}, "janta": {"name": "Wrap de Atum", "description": "Tortilha integral com atum, alface e tomate", "calories": 280, "time": "19:00"}, "total_calories": 1220},
    {"day": 4, "cafe_da_manha": {"name": "Pão Integral com Abacate", "description": "2 fatias pão integral, abacate amassado e ovo", "calories": 320, "time": "07:00"}, "almoco": {"name": "Strogonoff de Frango Light", "description": "Frango, cogumelos, iogurte natural, arroz integral", "calories": 400, "time": "12:00"}, "sobremesa": {"name": "Banana Assada com Canela", "description": "1 banana assada com canela e mel", "calories": 100, "time": "13:00"}, "lanche": {"name": "Cenoura com Homus", "description": "Palitos de cenoura com 3 colheres de homus", "calories": 150, "time": "16:00"}, "janta": {"name": "Omelete de Legumes", "description": "3 ovos with abobrinha, tomate e cebola", "calories": 280, "time": "19:00"}, "total_calories": 1250},
    {"day": 5, "cafe_da_manha": {"name": "Mingau de Aveia", "description": "Aveia, leite desnatado, banana e canela", "calories": 280, "time": "07:00"}, "almoco": {"name": "Salmão com Quinoa", "description": "120g salmão grelhado, quinoa e aspargos", "calories": 450, "time": "12:00"}, "sobremesa": {"name": "Picolé de Frutas Caseiro", "description": "Picolé de morango e iogurte natural", "calories": 80, "time": "13:00"}, "lanche": {"name": "Torrada com Ricota", "description": "2 torradas integrais com ricota e mel", "calories": 160, "time": "16:00"}, "janta": {"name": "Caldo Verde Light", "description": "Couve, batata, cebola e linguiça de frango", "calories": 250, "time": "19:00"}, "total_calories": 1220},
    {"day": 6, "cafe_da_manha": {"name": "Crepioca de Banana", "description": "Ovo, tapioca, banana e canela", "calories": 290, "time": "07:00"}, "almoco": {"name": "Frango ao Curry com Arroz", "description": "Frango, leite de coco, curry, arroz integral", "calories": 420, "time": "12:00"}, "sobremesa": {"name": "Mousse de Chocolate Fit", "description": "Abacate, cacau em pó e adoçante", "calories": 130, "time": "13:00"}, "lanche": {"name": "Maçã com Pasta de Amendoim", "description": "1 maçã com 1 colher de pasta de amendoim", "calories": 180, "time": "16:00"}, "janta": {"name": "Salada de Grão-de-Bico", "description": "Grão-de-bico, tomate, pepino, cebola roxa", "calories": 260, "time": "19:00"}, "total_calories": 1280},
    {"day": 7, "cafe_da_manha": {"name": "Panqueca de Banana e Aveia", "description": "2 ovos, 1 banana, 3 colheres de aveia", "calories": 300, "time": "07:00"}, "almoco": {"name": "Carne Assada com Mandioca", "description": "120g patinho, mandioca cozida, salada", "calories": 430, "time": "12:00"}, "sobremesa": {"name": "Salada de Frutas", "description": "Mix de frutas da estação com hortelã", "calories": 90, "time": "13:00"}, "lanche": {"name": "Bolo de Caneca Fit", "description": "Ovo, aveia, banana e cacau", "calories": 170, "time": "16:00"}, "janta": {"name": "Sopa de Frango com Legumes", "description": "Frango desfiado, cenoura, batata, chuchu", "calories": 270, "time": "19:00"}, "total_calories": 1260},
    {"day": 8, "cafe_da_manha": {"name": "Vitamina de Frutas", "description": "Leite desnatado, banana, mamão e aveia", "calories": 260, "time": "07:00"}, "almoco": {"name": "Escondidinho de Frango Fit", "description": "Purê de batata doce com frango desfiado", "calories": 400, "time": "12:00"}, "sobremesa": {"name": "Brigadeiro Fit", "description": "Leite em pó, cacau e adoçante", "calories": 110, "time": "13:00"}, "lanche": {"name": "Sanduíche Natural", "description": "Pão integral, peito de peru, alface, tomate", "calories": 180, "time": "16:00"}, "janta": {"name": "Peixe na Air Fryer", "description": "Tilápia temperada na air fryer com salada", "calories": 280, "time": "19:00"}, "total_calories": 1230},
    {"day": 9, "cafe_da_manha": {"name": "Ovos Mexidos com Tomate", "description": "3 ovos mexidos com tomate e manjericão", "calories": 270, "time": "07:00"}, "almoco": {"name": "Macarrão Integral ao Molho", "description": "Macarrão integral, molho de tomate caseiro, frango", "calories": 420, "time": "12:00"}, "sobremesa": {"name": "Pudim de Chia", "description": "Chia, leite de coco e frutas vermelhas", "calories": 130, "time": "13:00"}, "lanche": {"name": "Pipoca Natural", "description": "3 xícaras de pipoca estourada sem óleo", "calories": 100, "time": "16:00"}, "janta": {"name": "Frittata de Espinafre", "description": "Ovos, espinafre, queijo e tomate", "calories": 260, "time": "19:00"}, "total_calories": 1180},
    {"day": 10, "cafe_da_manha": {"name": "Panqueca de Maçã", "description": "Ovo, aveia, maçã ralada e canela", "calories": 280, "time": "07:00"}, "almoco": {"name": "Quibe Assado de Abóbora", "description": "Trigo para quibe, abóbora, hortelã e queijo", "calories": 350, "time": "12:00"}, "sobremesa": {"name": "Iogurte com Mel", "description": "Iogurte natural com mel e nozes", "calories": 140, "time": "13:00"}, "lanche": {"name": "Fruta com Aveia", "description": "1 maçã ou pera com 1 colher de aveia", "calories": 120, "time": "16:00"}, "janta": {"name": "Salada de Frango com Abacate", "description": "Frango, abacate, alface, tomate e limão", "calories": 310, "time": "19:00"}, "total_calories": 1200},
    {"day": 11, "cafe_da_manha": {"name": "Açaí Bowl Proteico", "description": "Açaí, whey protein, granola e banana", "calories": 310, "time": "07:00"}, "almoco": {"name": "Peito de Frango na Chapa", "description": "150g frango, arroz integral, feijão, salada", "calories": 440, "time": "12:00"}, "sobremesa": {"name": "Gelatina com Creme de Ricota", "description": "Gelatina diet com ricota batida", "calories": 80, "time": "13:00"}, "lanche": {"name": "Biscoito de Arroz com Patê", "description": "4 biscoitos de arroz com patê de atum", "calories": 150, "time": "16:00"}, "janta": {"name": "Creme de Abóbora", "description": "Abóbora, gengibre, cebola e frango desfiado", "calories": 240, "time": "19:00"}, "total_calories": 1220},
    {"day": 12, "cafe_da_manha": {"name": "Ovo Cozido com Abacate", "description": "2 ovos cozidos, meio abacate, torrada", "calories": 300, "time": "07:00"}, "almoco": {"name": "Carne de Panela com Legumes", "description": "Patinho, cenoura, batata, chuchu", "calories": 400, "time": "12:00"}, "sobremesa": {"name": "Doce de Banana Fit", "description": "Banana com canela e mel no forno", "calories": 110, "time": "13:00"}, "lanche": {"name": "Vitamina Proteica", "description": "Leite, banana, aveia e whey protein", "calories": 190, "time": "16:00"}, "janta": {"name": "Salada Mediterrânea", "description": "Alface, atum, ovo, tomate, azeitonas", "calories": 280, "time": "19:00"}, "total_calories": 1280},
    {"day": 13, "cafe_da_manha": {"name": "Panqueca de Espinafre", "description": "Ovos, espinafre, aveia e queijo branco", "calories": 290, "time": "07:00"}, "almoco": {"name": "Lombo Assado com Purê", "description": "120g lombo, purê de mandioquinha, salada", "calories": 410, "time": "12:00"}, "sobremesa": {"name": "Morango com Chocolate", "description": "Morangos com chocolate 70% derretido", "calories": 120, "time": "13:00"}, "lanche": {"name": "Tapioca Doce", "description": "Tapioca com banana e canela", "calories": 170, "time": "16:00"}, "janta": {"name": "Sopa de Lentilha", "description": "Lentilha, cenoura, alho-poró e gengibre", "calories": 260, "time": "19:00"}, "total_calories": 1250},
    {"day": 14, "cafe_da_manha": {"name": "Iogurte com Granola Fit", "description": "Iogurte natural, granola sem açúcar, frutas", "calories": 270, "time": "07:00"}, "almoco": {"name": "Moqueca de Peixe Light", "description": "Tilápia, leite de coco, pimentão, arroz", "calories": 420, "time": "12:00"}, "sobremesa": {"name": "Picolé de Iogurte", "description": "Iogurte congelado com frutas vermelhas", "calories": 90, "time": "13:00"}, "lanche": {"name": "Chips de Batata Doce", "description": "Batata doce fatiada assada no forno", "calories": 140, "time": "16:00"}, "janta": {"name": "Omelete Recheada", "description": "Omelete com presunto de peru e queijo branco", "calories": 300, "time": "19:00"}, "total_calories": 1220},
    {"day": 15, "cafe_da_manha": {"name": "Pão de Batata Doce", "description": "Pão de batata doce caseiro com queijo", "calories": 290, "time": "07:00"}, "almoco": {"name": "Frango Xadrez", "description": "Frango em cubos, pimentão, amendoim, molho shoyu", "calories": 400, "time": "12:00"}, "sobremesa": {"name": "Smoothie de Morango", "description": "Morango, iogurte e mel", "calories": 100, "time": "13:00"}, "lanche": {"name": "Bolinho de Grão-de-Bico", "description": "Falafel assado com molho de iogurte", "calories": 170, "time": "16:00"}, "janta": {"name": "Salada de Quinoa", "description": "Quinoa, pepino, tomate, hortelã e limão", "calories": 260, "time": "19:00"}, "total_calories": 1220},
    {"day": 16, "cafe_da_manha": {"name": "Crepioca Salgada", "description": "Tapioca com ovo, queijo e orégano", "calories": 300, "time": "07:00"}, "almoco": {"name": "Filé de Tilápia Grelhado", "description": "Tilápia, arroz integral, legumes salteados", "calories": 380, "time": "12:00"}, "sobremesa": {"name": "Mousse de Limão Fit", "description": "Iogurte, suco de limão e adoçante", "calories": 100, "time": "13:00"}, "lanche": {"name": "Mix de Frutas Secas", "description": "Damasco, uva passa e castanhas", "calories": 160, "time": "16:00"}, "janta": {"name": "Creme de Brócolis", "description": "Brócolis, batata, cebola e queijo branco", "calories": 250, "time": "19:00"}, "total_calories": 1190},
    {"day": 17, "cafe_da_manha": {"name": "Waffle de Aveia", "description": "Aveia, ovo, banana e canela", "calories": 280, "time": "07:00"}, "almoco": {"name": "Espaguete de Abobrinha", "description": "Abobrinha em tiras, molho bolonhesa magro", "calories": 350, "time": "12:00"}, "sobremesa": {"name": "Trufa Fit de Cacau", "description": "Tâmaras, cacau em pó e coco ralado", "calories": 120, "time": "13:00"}, "lanche": {"name": "Ovo Cozido com Sal Rosa", "description": "2 ovos cozidos temperados", "calories": 140, "time": "16:00"}, "janta": {"name": "Bowl Mexicano", "description": "Arroz, feijão preto, frango, abacate, salsa", "calories": 320, "time": "19:00"}, "total_calories": 1210},
    {"day": 18, "cafe_da_manha": {"name": "Overnight Oats", "description": "Aveia, leite, chia, banana e mel", "calories": 300, "time": "07:00"}, "almoco": {"name": "Frango Assado com Batata", "description": "Coxa desossada, batata, cenoura, alecrim", "calories": 430, "time": "12:00"}, "sobremesa": {"name": "Salada de Frutas Tropicais", "description": "Manga, abacaxi, mamão e coco", "calories": 90, "time": "13:00"}, "lanche": {"name": "Sanduíche de Atum", "description": "Pão integral, atum, alface e tomate", "calories": 180, "time": "16:00"}, "janta": {"name": "Sopa de Tomate", "description": "Tomates assados, manjericão e croutons integrais", "calories": 220, "time": "19:00"}, "total_calories": 1220},
    {"day": 19, "cafe_da_manha": {"name": "Wrap de Ovo e Queijo", "description": "Tortilha integral, ovo mexido, queijo", "calories": 310, "time": "07:00"}, "almoco": {"name": "Arroz de Forno com Frango", "description": "Arroz integral, frango desfiado, milho, ervilha", "calories": 420, "time": "12:00"}, "sobremesa": {"name": "Gelatina Colorida", "description": "Camadas de gelatina diet com creme", "calories": 70, "time": "13:00"}, "lanche": {"name": "Palitos de Pepino", "description": "Pepino com cream cheese light", "calories": 80, "time": "16:00"}, "janta": {"name": "Frango com Brócolis", "description": "Frango salteado com brócolis e gengibre", "calories": 300, "time": "19:00"}, "total_calories": 1180},
    {"day": 20, "cafe_da_manha": {"name": "Omelete Fit", "description": "3 ovos, peito de peru, queijo cottage", "calories": 290, "time": "07:00"}, "almoco": {"name": "Escondidinho de Carne Seca", "description": "Purê de aipim light, carne seca desfiada", "calories": 400, "time": "12:00"}, "sobremesa": {"name": "Pavê de Maracujá Fit", "description": "Biscoito integral, creme de maracujá light", "calories": 130, "time": "13:00"}, "lanche": {"name": "Castanha do Pará", "description": "3 castanhas do Pará com 1 fruta", "calories": 150, "time": "16:00"}, "janta": {"name": "Salada de Atum", "description": "Atum, ovo cozido, alface, tomate, cenoura", "calories": 280, "time": "19:00"}, "total_calories": 1250},
    {"day": 21, "cafe_da_manha": {"name": "Panqueca Proteica", "description": "Ovos, aveia, whey, banana e canela", "calories": 300, "time": "07:00"}, "almoco": {"name": "Frango Grelhado Especial", "description": "Frango, quinoa, legumes assados, molho pesto", "calories": 440, "time": "12:00"}, "sobremesa": {"name": "Bolo de Chocolate Fit", "description": "Bolo com cacau, aveia e adoçante", "calories": 140, "time": "13:00"}, "lanche": {"name": "Açaí Bowl Final", "description": "Açaí com frutas e granola light - celebração!", "calories": 180, "time": "16:00"}, "janta": {"name": "Sopa Celebração", "description": "Sopa especial de legumes com frango desfiado", "calories": 250, "time": "19:00"}, "total_calories": 1310},
]

async def init_db():
    existing_modules = await db.modules.count_documents({})
    if existing_modules == 0:
        for module in MODULES:
            await db.modules.insert_one(module.copy())
        logging.info("Modules initialized")
    existing_pdfs = await db.pdfs.count_documents({})
    if existing_pdfs == 0:
        for pdf_data in INITIAL_PDFS:
            pdf = PDFContent(**pdf_data)
            await db.pdfs.insert_one(pdf.model_dump())
        logging.info("Initial PDFs inserted")
    default_user = await db.users.find_one({"email": "jholamonie@outlook.com"}, {"_id": 0})
    if not default_user:
        user = User(email="jholamonie@outlook.com", name="Usuário Nutri")
        await db.users.insert_one(user.model_dump())
        logging.info("Default user created")
    existing_news = await db.news.count_documents({})
    if existing_news == 0:
        initial_news = [
            {"title": "Bem-vindo ao Nutri de Pobre!", "content": "Sua jornada para uma alimentação saudável e acessível começa agora. Explore nossos módulos e receitas!", "image": "https://images.unsplash.com/photo-1654458804670-2f4f26ab3154?w=400"},
            {"title": "Novo Desafio de 21 Dias!", "content": "Participe do nosso desafio de 21 dias para eliminar 5kg com alimentação saudável e balanceada.", "image": "https://images.unsplash.com/photo-1612287460861-fe8f50a81811?w=400"},
            {"title": "Dica: Hidratação é Essencial", "content": "Beba pelo menos 2 litros de água por dia. A hidratação adequada acelera o metabolismo e ajuda na perda de peso.", "image": "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400"},
        ]
        for n in initial_news:
            news = News(**n)
            await db.news.insert_one(news.model_dump())
        logging.info("Initial news created")

@api_router.post("/login", response_model=LoginResponse)
async def login_user(request: LoginRequest):
    if request.password != DEFAULT_PASSWORD:
        return LoginResponse(success=False, message="Senha incorreta. Use a senha padrão: receitas321")
    user_data = await db.users.find_one({"email": request.email.lower()}, {"_id": 0})
    if not user_data:
        user = User(email=request.email.lower(), name=request.email.split("@")[0])
        await db.users.insert_one(user.model_dump())
        user_data = user.model_dump()
    return LoginResponse(success=True, message="Login realizado com sucesso!", user=User(**user_data))

@api_router.get("/user/{email}")
async def get_user(email: str):
    user_data = await db.users.find_one({"email": email.lower()}, {"_id": 0})
    if not user_data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return User(**user_data)

@api_router.get("/modules")
async def get_modules():
    modules = await db.modules.find({}, {"_id": 0}).sort("number", 1).to_list(100)
    result = []
    for module in modules:
        pdfs = await db.pdfs.find({"module_id": module["id"]}, {"_id": 0}).to_list(100)
        module["pdfs"] = pdfs
        result.append(module)
    return result

@api_router.get("/modules/{module_id}")
async def get_module(module_id: str):
    module = await db.modules.find_one({"id": module_id}, {"_id": 0})
    if not module:
        raise HTTPException(status_code=404, detail="Módulo não encontrado")
    pdfs = await db.pdfs.find({"module_id": module_id}, {"_id": 0}).to_list(100)
    module["pdfs"] = pdfs
    return module

@api_router.get("/pdfs")
async def get_all_pdfs():
    pdfs = await db.pdfs.find({}, {"_id": 0}).to_list(1000)
    return pdfs

@api_router.get("/pdfs/module/{module_id}")
async def get_pdfs_by_module(module_id: str):
    pdfs = await db.pdfs.find({"module_id": module_id}, {"_id": 0}).to_list(100)
    return pdfs

@api_router.post("/pdfs")
async def create_pdf(pdf_data: PDFCreate):
    pdf = PDFContent(**pdf_data.model_dump())
    await db.pdfs.insert_one(pdf.model_dump())
    return pdf

@api_router.get("/meal-plan")
async def get_meal_plan():
    return MEAL_PLAN

@api_router.get("/meal-plan/{day}")
async def get_day_plan(day: int):
    if day < 1 or day > 21:
        raise HTTPException(status_code=404, detail="Dia deve ser entre 1 e 21")
    return MEAL_PLAN[day - 1]

@api_router.get("/news")
async def get_news():
    news = await db.news.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return news

@api_router.post("/news")
async def create_news(news_data: NewsCreate):
    news = News(**news_data.model_dump())
    await db.news.insert_one(news.model_dump())
    return news

@api_router.get("/search")
async def search(q: str):
    query = {"$regex": q, "$options": "i"}
    modules = await db.modules.find({"$or": [{"title": query}, {"description": query}]}, {"_id": 0}).to_list(100)
    pdfs = await db.pdfs.find({"name": query}, {"_id": 0}).to_list(100)
    return {"modules": modules, "pdfs": pdfs}

@api_router.get("/")
async def root():
    return {"message": "Nutri de Pobre API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Database initialized")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
