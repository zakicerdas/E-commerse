import  prisma  from "../prisma";
import type { Store } from "../generated/client";

export const getAllStore = async (): Promise<Store[]> => {
    return await prisma.store.findMany();
};

export const getStoreById = async (id: number): Promise<Store> => {
    const store = await prisma.store.findUnique({
        where: { id },
    });
    
    if (!store) {
        throw new Error('Store not found');
    }
    
    return store;
};

export const createStore = async (data: { name: string; email: string; address: string; }): Promise<Store> => {
    return await prisma.store.create({
        data: {
            name: data.name,
            email: data.email,
            address: data.address,
        },
    });
};

export const updateStore = async (id: number, data: Partial<Store>): Promise<Store> => {
    await getStoreById(id); // Cek existance

    return await prisma.store.update({
        where: { id },
        data,
    });
};

export const deleteStore = async (id: number): Promise<Store> => {
    await getStoreById(id); // Cek existance

    return await prisma.store.delete({
        where: { id },
    });
};

export const searchStore = async (name?: string): Promise<Store[]> => {
    let result = await getAllStore();
    if (name) {
        result = result.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
    }
    return result;
};