import { sequelize } from '../config/database.js';
import readline from 'readline/promises';
import dotenv from 'dotenv';

dotenv.config();

async function deleteAllTablesWithConfirmation() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        console.log('🔍 Conectando a la base de datos...');
        await sequelize.authenticate();

        // Obtener listado de tablas
        const [tables] = await sequelize.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    `);

        if (tables.length === 0) {
            console.log('ℹ️ No hay tablas para eliminar');
            return;
        }

        console.log('\n📊 Tablas encontradas:');
        tables.forEach((table, index) => {
            console.log(`${index + 1}. ${table.tablename}`);
        });

        // Confirmación
        console.log('\n🚨🚨🚨 ADVERTENCIA CRÍTICA 🚨🚨🚨');
        console.log(`Vas a eliminar ${tables.length} tablas de la base de datos`);
        console.log('Esta acción es IRREVERSIBLE y puede causar pérdida de datos');

        const confirm1 = await rl.question('\n¿Estás ABSOLUTAMENTE seguro? (yes/no): ');
        if (confirm1.toLowerCase() !== 'yes') {
            console.log('❌ Operación cancelada');
            return;
        }

        const confirm2 = await rl.question('Escribe "ELIMINAR-TODO" para confirmar: ');
        if (confirm2 !== 'ELIMINAR-TODO') {
            console.log('❌ Operación cancelada');
            return;
        }

        // Proceder con la eliminación
        console.log('\n🔄 Eliminando tablas...');
        await sequelize.query('SET session_replication_role = replica;');

        for (const table of tables) {
            try {
                await sequelize.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
                console.log(`✅ Eliminada: ${table.tablename}`);
            } catch (error) {
                console.log(`⚠️  Error con ${table.tablename}:`, error.message);
            }
        }

        await sequelize.query('SET session_replication_role = DEFAULT;');
        console.log(`\n🎉 ¡Eliminadas ${tables.length} tablas!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
        await sequelize.close();
    }
}

deleteAllTablesWithConfirmation();