import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-muted py-6 mt-auto border-t border-border">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm font-medium text-muted-foreground">
                    <span className="text-foreground font-bold">© 2024 AgriTech</span>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                        <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
                    </div>
                </div>

                <Link href="https://github.com/nishanth-kj/agriculture" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <FaGithub size={20} />
                </Link>
            </div>
        </footer>
    );
}
