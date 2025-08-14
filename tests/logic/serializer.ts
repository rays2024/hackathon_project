export class BincodeSerializer {
    buffer: Buffer
    len: number

    constructor() {
        this.buffer = Buffer.alloc(0)
        this.len = 0
    }
    writeUint(n: bigint, type) {
        if (type == 'u8') {
            let temp = Buffer.alloc(1)
            temp.writeUInt8(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 1
        } else if (type == 'u16') {
            let temp = Buffer.alloc(2)
            temp.writeUInt16LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 2
        } else if (type == 'u32') {
            let temp = Buffer.alloc(4)
            temp.writeUInt32LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 4
        } else if (type == 'u64') {
            let temp = Buffer.alloc(8)
            temp.writeBigUInt64LE(n, 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 8
        } else if (type == 'u128') {
            let mod = BigInt(2) ** BigInt(64)
            let a = n / mod
            let b = n % mod
            this.writeUint(b, 'u64')
            this.writeUint(a, 'u64')
        } else if (type == 'u256') {
            let mod = BigInt(2) ** BigInt(128)
            let a = n / mod
            let b = n % mod
            this.writeUint(b, 'u128')
            this.writeUint(a, 'u128')
        } else {
            throw "not supported type " + type;
        }
    }

    writeInt(n: bigint, type) {
        if (type == 'i8') {
            let temp = Buffer.alloc(1)
            temp.writeInt8(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 1
        } else if (type == 'i16') {
            let temp = Buffer.alloc(2)
            temp.writeInt16LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 2
        } else if (type == 'i32') {
            let temp = Buffer.alloc(4)
            temp.writeInt32LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 4
        } else if (type == 'i64') {
            let temp = Buffer.alloc(8)
            temp.writeBigInt64LE(n, 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 8
        } else if (type == 'i128') {

            if (n >= BigInt(0)) {
                this.writeUint(n, 'u128')
            } else {
                let newN = (BigInt(1) << BigInt(128)) - (n * BigInt(-1))
                this.writeUint(newN, 'u128')
            }

        } else if (type == 'i256') {
            if (n >= BigInt(0)) {
                this.writeUint(n, 'u256')
            } else {
                let newN = (BigInt(1) << BigInt(256)) - (n * BigInt(-1))
                this.writeUint(newN, 'u256')
            }
        } else {
            throw "not supported type " + type;
        }
    }

    writeDouble(n: number) {
        let temp = Buffer.alloc(8)
        temp.writeDoubleLE(n, 0)
        this.buffer = Buffer.concat([this.buffer, temp])
        this.len += 8
    }

    writeString(s: string) {
        let temp = Buffer.alloc(s.length + 8)
        temp.writeBigUInt64LE(BigInt(s.length))
        temp.write(s, 8, 'utf8')
        this.buffer = Buffer.concat([this.buffer, temp])
        this.len += s.length + 4
    }

}
