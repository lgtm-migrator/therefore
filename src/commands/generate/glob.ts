import { fixPath, fstat, isJust, isRight, Nothing } from '@zefiros-software/axioms'
import fastGlob from 'fast-glob'

import path from 'path'

// should give the same glob behaviour as Prettier
// https://github.com/prettier/prettier/blob/main/src/cli/expand-patterns.js
// also heavily inspired by the logic there :)
export async function expandGlobs({
    patterns,
    ignore = [],
    cwd,
    extension,
}: {
    patterns: string[]
    ignore?: string[]
    cwd: string
    extension: string
}): Promise<string[]> {
    const ignoredDirectories = ['.git', '.svn', '.hg', 'node_modules']
    const globOptions = {
        dot: true,
        ignore: [...ignoredDirectories.map((dir) => `**/${dir}`), ...ignore],
    }

    const entries: string[] = (
        await Promise.all(
            patterns.map(async (pattern) => {
                const absolutePath = path.resolve(cwd, pattern)
                if (ignoredDirectories.some((i) => pattern.includes(i))) {
                    return Nothing
                }

                const eitherStat = await fstat(absolutePath)
                if (isRight(eitherStat) && eitherStat.right !== Nothing) {
                    if (eitherStat.right.isFile()) {
                        return fastGlob.escapePath(fixPath(pattern))
                    } else if (eitherStat.right.isDirectory()) {
                        return `${fastGlob.escapePath(fixPath(path.relative(cwd, absolutePath) ?? '.'))}/**/*${extension}`
                    }

                    return Nothing
                } else if (pattern.startsWith('!')) {
                    globOptions.ignore.push(fixPath(pattern.slice(1)))
                    return Nothing
                }
                return fixPath(pattern)
            })
        )
    ).filter(isJust)
    return await fastGlob(entries, globOptions)
}
