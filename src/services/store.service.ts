import  prisma  from "../prisma";
import type { Store } from "../generated/client";

export const getAllStore = async (): Promise<Store[]> => {
    return await prisma.store.findMany();
};

export const getStoreById = async (id: string): Promise<Store> => {
    const store = await prisma.store.findUnique({
        where: { id },
    });
    
    if (!store) {
        throw new Error('Store not found');
    }
    
    return store;
};

export const createStore = async (data: { name: string; email: string; address: string; userId: string }): Promise<Store> => {
    return await prisma.store.create({
        data: {
            name: data.name,
            email: data.email,
            address: data.address,
            userId: data.userId,
        },
    });
};

export const updateStore = async (id: string, data: Partial<Store>): Promise<Store> => {
    await getStoreById(id); // Cek existance

    return await prisma.store.update({
        where: { id },
        data,
    });
};

export const deleteStore = async (id: string): Promise<Store> => {
    await getStoreById(id); // Cek existance

    return await prisma.store.update({
        where: { id },
        data:{
            deletedAt: new Date()
        }
    });
};

export const searchStore = async (name?: string): Promise<Store[]> => {
    let result = await getAllStore();
    if (name) {
        result = result.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
    }
    return result;
};