import { logger } from '@config/logger';
import { Router, Request, Response } from 'express';
import path from 'path';
import { success } from 'src/utils/response';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(success(
        'API is running', 
        { 
            name: 'Adote Pets API', 
            version: '1.0.0', 
            description: 'API para o sistema de adoção de pets',
            organization: 'Sonata dos Bytes',
            organizationUrl: 'https://github.com/Sonata-dos-Bytes',
            authors: [
                { 
                    name: 'Erikli Arruda' , 
                    github: 'https://github.com/Erikli999',
                    picture: 'https://avatars.githubusercontent.com/u/138739176?v=4'
                },
                { 
                    name: 'Pedro Henrique Martins Borges', 
                    github: 'https://github.com/piedro404',
                    picture: 'https://avatars.githubusercontent.com/u/88720549?v=4'
                },
                { 
                    name: 'Guilherme Felipe', 
                    github: 'https://github.com/guilherme-felipe123',
                    picture: 'https://avatars.githubusercontent.com/u/115903669?v=4'
                },
                { 
                    name: 'Luan Jacomini Kloh', 
                    github: 'https://github.com/luanklo',
                    picture: 'https://avatars.githubusercontent.com/u/53999727?v=4'
                },
                { 
                    name: 'Matheus Augusto', 
                    github: 'https://github.com/Matheuz233',
                    picture: 'https://avatars.githubusercontent.com/u/138679799?v=4'
                },
                { 
                    name: 'Thayna Bezerra', 
                    github: 'https://github.com/thayna-bezerra',
                    picture: 'https://avatars.githubusercontent.com/u/58120519?v=4'
                },
            ],
        }
    ));
});

router.get('/favicon.ico', (req, res) => {
    res.sendFile(path.resolve("./src/static/favicon.ico"));
});

export default router;
